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
        from: `"FPOP HealthHub" <${process.env.SENDER_EMAIL}>`,
        to: patient.email,
        subject: "Appointment Confirmation – FPOP HealthHub",
        html: `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0, 59, 111, 0.08);">
      <div style="background: linear-gradient(135deg, #003B6F 0%, #1A5276 100%); padding: 32px 32px 24px; text-align: center;">
        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C518" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <span style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <div style="display: inline-block; background: rgba(245,197,24,0.15); padding: 6px 18px; border-radius: 20px; margin-top: 4px;">
          <p style="margin: 0; font-size: 12px; color: #F5C518; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase;">Booking Confirmed</p>
        </div>
      </div>
      <div style="padding: 36px 32px 28px;">
        <p style="font-size: 16px; color: #1A2A3A; line-height: 1.7; margin: 0 0 6px;">Hi <strong style="color: #003B6F;">${patient.firstName}</strong>,</p>
        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 28px;">Your appointment request has been submitted and is awaiting confirmation. Here's a summary:</p>
        <div style="background: #F8FAFC; border-radius: 14px; padding: 4px 0; margin-bottom: 28px; border: 1px solid #E8EEF4;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500; width: 38%;">Service</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${serviceName}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Healthcare Provider</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${populated.staffId?.firstName || ""} ${populated.staffId?.lastName || ""}${populated.staffId?.specialty ? ` <span style="color: #64748b; font-weight: 400;">(${populated.staffId.specialty})</span>` : ""}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Date</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${formattedDate}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Time</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${time}</td></tr>
            <tr><td style="padding: 14px 20px; color: #64748b; font-size: 13px; font-weight: 500;">Status</td><td style="padding: 14px 20px; color: #1A2A3A; font-size: 13px;"><span style="display: inline-block; background: #FEF3C7; color: #92400E; padding: 3px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;">Pending</span></td></tr>
          </table>
        </div>
        <div style="background: #F0F7FF; border-left: 4px solid #003B6F; padding: 16px 20px; border-radius: 10px; margin-bottom: 28px;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #003B6F;">📌 Reminder</p>
          <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">Please arrive 10 minutes before your scheduled time. Bring a valid ID and your appointment reference.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #E8EEF4; padding-top: 24px;">
          <p style="font-size: 13px; color: #94A3B8; margin: 0 0 4px; font-weight: 500;">Thank you for choosing FPOP HealthHub.</p>
          <p style="font-size: 12px; color: #B0BEC5; margin: 0;">We look forward to serving you.</p>
        </div>
      </div>
    </div>
  </div>`,
      };

      transporter.sendMail(mailOptions).then(() => console.log("Appointment confirmation email sent to:", patient.email)).catch((err) => console.error("Appointment confirmation email failed:", err.message || err));
    }

    const staffName = `${populated.staffId?.firstName || ""} ${populated.staffId?.lastName || ""}`.trim();
    const patientName = patient?.firstName || "A patient";

    Promise.all([
      notificationModel.create({
        title: "Appointment Booked",
        text: `Your appointment for ${serviceName} with ${staffName} on ${date} at ${time} has been submitted. Awaiting confirmation.`,
        category: "Appointment",
        priority: "Medium",
        userId: patientId,
      }),
      notificationModel.create({
        title: "New Appointment",
        text: `${patientName} booked ${serviceName} with ${staffName} on ${date} at ${time}.`,
        category: "Appointment",
        priority: "Medium",
        userId: populated.staffId?._id,
      }),
      notificationModel.create({
        title: "New Appointment Booked",
        text: `${patientName} booked ${serviceName} with ${staffName} on ${date} at ${time}.`,
        category: "Appointment",
        priority: "Medium",
      }),
    ]).catch(() => {});

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
      .populate("patientId", "firstName lastName email phone avatar")
      .sort({ date: -1, time: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const appointment = await appointmentModel
      .findById(id)
      .populate("patientId", "firstName lastName email")
      .populate("staffId", "firstName lastName specialty");

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (req.user.role !== "admin" && appointment.staffId._id.toString() !== req.user.id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin" && appointment.status !== "pending") {
      return res.json({ success: false, message: "Appointment is no longer pending" });
    }

    appointment.status = status;
    await appointment.save();

    const patient = appointment.patientId;
    const staff = appointment.staffId;
    const dateObj = new Date(appointment.date + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const statusLabel = status === "confirmed" ? "Confirmed" : "Cancelled";
    const statusColor = status === "confirmed" ? "#15803d" : "#DC2626";
    const statusBg = status === "confirmed" ? "#dcfce7" : "#fee2e2";
    const headingBg = status === "confirmed" ? "#003B6F" : "#991B1B";

    const mailOptions = {
      from: `"FPOP HealthHub" <${process.env.SENDER_EMAIL}>`,
      to: patient.email,
      subject: `Appointment ${statusLabel} – FPOP HealthHub`,
      html: `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0, 59, 111, 0.08);">
      <div style="background: linear-gradient(135deg, ${headingBg} 0%, ${status === "confirmed" ? "#1A5276" : "#7F1D1D"} 100%); padding: 32px 32px 24px; text-align: center;">
        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C518" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <span style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <div style="display: inline-block; background: ${status === "confirmed" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}; padding: 6px 18px; border-radius: 20px; margin-top: 4px;">
          <p style="margin: 0; font-size: 12px; color: ${statusColor}; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase;">Appointment ${statusLabel}</p>
        </div>
      </div>
      <div style="padding: 36px 32px 28px;">
        <p style="font-size: 16px; color: #1A2A3A; line-height: 1.7; margin: 0 0 6px;">Hi <strong style="color: #003B6F;">${patient.firstName}</strong>,</p>
        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 28px;">Your appointment has been <strong style="color: ${statusColor};">${statusLabel.toLowerCase()}</strong>. Here are the details:</p>
        <div style="background: #F8FAFC; border-radius: 14px; padding: 4px 0; margin-bottom: 28px; border: 1px solid #E8EEF4;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500; width: 38%;">Service</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${appointment.serviceName}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Healthcare Provider</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${staff.firstName} ${staff.lastName}${staff.specialty ? ` <span style="color: #64748b; font-weight: 400;">(${staff.specialty})</span>` : ""}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Date</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${formattedDate}</td></tr>
            <tr><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #64748b; font-size: 13px; font-weight: 500;">Time</td><td style="padding: 14px 20px; border-bottom: 1px solid #E8EEF4; color: #1A2A3A; font-size: 13px; font-weight: 600;">${appointment.time}</td></tr>
            <tr><td style="padding: 14px 20px; color: #64748b; font-size: 13px; font-weight: 500;">Status</td><td style="padding: 14px 20px; color: #1A2A3A; font-size: 13px;"><span style="display: inline-block; background: ${statusBg}; color: ${statusColor}; padding: 3px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;">${statusLabel}</span></td></tr>
          </table>
        </div>
        <div style="text-align: center; border-top: 1px solid #E8EEF4; padding-top: 24px;">
          <p style="font-size: 13px; color: #94A3B8; margin: 0 0 4px; font-weight: 500;">Thank you for choosing FPOP HealthHub.</p>
          <p style="font-size: 12px; color: #B0BEC5; margin: 0;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </div>
  </div>`,
    };

    transporter.sendMail(mailOptions).then(() => console.log("Appointment status email sent to:", patient.email)).catch((err) => console.error("Appointment status email failed:", err.message || err));

    Promise.all([
      notificationModel.create({
        title: `Appointment ${statusLabel}`,
        text: `Your appointment with ${staff.firstName} ${staff.lastName} on ${appointment.date} at ${appointment.time} has been ${statusLabel.toLowerCase()}.`,
        category: "Appointment",
        priority: status === "confirmed" ? "Medium" : "High",
        userId: patient._id,
      }),
      notificationModel.create({
        title: `Appointment ${statusLabel}`,
        text: `Appointment for ${patient.firstName} ${patient.lastName} with ${staff.firstName} ${staff.lastName} on ${appointment.date} at ${appointment.time} has been ${statusLabel.toLowerCase()}.`,
        category: "Appointment",
        priority: status === "confirmed" ? "Medium" : "High",
      }),
    ]).catch(() => {});

    res.json({ success: true, appointment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getAvailableSlots, createAppointment, getUserAppointments, getStaffAppointments, updateAppointmentStatus };
