import appointmentModel from "../models/appointmentModels.js";
import userModel from "../models/userModel.js";

const generateTimeSlots = (start, end) => {
  const slots = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let current = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  const lunchStart = 12 * 60;
  const lunchEnd = 13 * 60;

  while (current + 30 <= endTotal) {
    if (current >= lunchStart && current < lunchEnd) {
      current = lunchEnd;
      continue;
    }
    const h = Math.floor(current / 60);
    const m = current % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    slots.push(
      `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`
    );
    current += 30;
  }
  return slots;
};

const getAvailableSlots = async (req, res) => {
  try {
    const { staffId, date } = req.query;
    if (!staffId || !date) {
      return res.json({ success: false, message: "Missing staffId or date" });
    }

    const staff = await userModel.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.json({ success: false, message: "Staff not found" });
    }

    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const daySchedule = staff.schedule ? staff.schedule[dayOfWeek] : null;

    if (!daySchedule || !daySchedule.active) {
      return res.json({ success: true, slots: [] });
    }

    const allSlots = generateTimeSlots(daySchedule.start, daySchedule.end);

    const bookedAppointments = await appointmentModel.find({
      staffId,
      date,
      status: { $ne: "cancelled" },
    });
    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

    const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot));

    res.json({ success: true, slots: availableSlots });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { staffId, serviceId, serviceName, date, time } = req.body;
    const patientId = req.user.id;

    if (!staffId || !serviceId || !serviceName || !date || !time) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existing = await appointmentModel.findOne({
      staffId,
      date,
      time,
      status: { $ne: "cancelled" },
    });
    if (existing) {
      return res.json({
        success: false,
        message: "This time slot is no longer available",
      });
    }

    const appointment = await appointmentModel.create({
      patientId,
      staffId,
      serviceId,
      serviceName,
      date,
      time,
      status: "pending",
    });

    const populated = await appointmentModel
      .findById(appointment._id)
      .populate("staffId", "firstName lastName specialty");

    res.json({ success: true, appointment: populated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ patientId: req.user.id })
      .populate("staffId", "firstName lastName specialty")
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getStaffAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ staffId: req.user.id })
      .populate("patientId", "firstName lastName email phone")
      .sort({ date: -1, time: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getAvailableSlots, createAppointment, getUserAppointments, getStaffAppointments };
