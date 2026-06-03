import appointmentModel from "../models/appointmentModels.js";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";
import notificationModel from "../models/notificationModel.js";

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

    const patient = await userModel.findById(patientId);
    if (patient) {
      const dateObj = new Date(date + "T00:00:00");
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: patient.email,
        subject: "Appointment Confirmation – FPOP HealthHub",
        html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 59, 111, 0.05); border: 1px solid #E6EFF7;">
      <div style="background-color: #003B6F; padding: 28px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #F5C518;">
        <div style="margin-bottom: 10px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 0.5px; vertical-align: middle; margin-left: 8px; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #D1E4F5; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Appointment Confirmed</p>
      </div>
      <div style="padding: 32px 28px;">
        <p style="font-size: 15px; color: #1A2A3A; line-height: 1.6; margin: 0 0 20px;">Hi <strong>${patient.firstName}</strong>,</p>
        <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin: 0 0 20px;">Your appointment has been booked successfully. Here's a summary of your booking:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #64748b; font-size: 13px; font-weight: 500;">Service</td><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #1A2A3A; font-size: 13px; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #64748b; font-size: 13px; font-weight: 500;">Doctor</td><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #1A2A3A; font-size: 13px; font-weight: 600;">${populated.staffId?.firstName || ""} ${populated.staffId?.lastName || ""}${populated.staffId?.specialty ? ` (${populated.staffId.specialty})` : ""}</td></tr>
          <tr><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #64748b; font-size: 13px; font-weight: 500;">Date</td><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #1A2A3A; font-size: 13px; font-weight: 600;">${formattedDate}</td></tr>
          <tr><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #64748b; font-size: 13px; font-weight: 500;">Time</td><td style="padding: 12px 14px; border-bottom: 1px solid #E6EFF7; color: #1A2A3A; font-size: 13px; font-weight: 600;">${time}</td></tr>
          <tr><td style="padding: 12px 14px; color: #64748b; font-size: 13px; font-weight: 500;">Status</td><td style="padding: 12px 14px; color: #1A2A3A; font-size: 13px; font-weight: 600;"><span style="background: #FEF3C7; color: #92400E; padding: 2px 10px; border-radius: 4px; font-size: 12px;">Pending</span></td></tr>
        </table>
        <div style="background: #F0F7FF; border-left: 4px solid #003B6F; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #003B6F;">Reminder</p>
          <p style="margin: 0; font-size: 12.5px; color: #4a5568; line-height: 1.5;">Please arrive 10 minutes before your scheduled time. Bring a valid ID and your appointment reference.</p>
        </div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.6; margin: 0 0 8px;">We'd love to hear your feedback after your visit. Your input helps us serve you better.</p>
        <p style="font-size: 13px; color: #8a96a3; text-align: center; margin: 24px 0 0; border-top: 1px solid #E6EFF7; padding-top: 20px;">Thank you for choosing FPOP HealthHub.</p>
      </div>
    </div>
  </div>`,
      };

      await transporter.sendMail(mailOptions).catch(() => {});
    }

    await notificationModel.create({
      title: "New Appointment Booked",
      text: `${patient?.firstName || "A patient"} booked ${serviceName} with ${populated.staffId?.firstName || ""} ${populated.staffId?.lastName || ""} on ${date} at ${time}.`,
      category: "Appointment",
      priority: "Medium",
    });

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
