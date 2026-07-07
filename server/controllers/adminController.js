import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModels.js";
import notificationModel from "../models/notificationModel.js";

const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password").sort({ createdAt: -1 });
    const formatted = users.map((u) => ({
      _id: u._id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      role: u.role,
      isAccountVerified: u.isAccountVerified,
      isSuspended: u.isSuspended || false,
      joinDate: u.createdAt,
      avatar: u.avatar || "",
      specialty: u.specialty || "",
      schedule: u.schedule || {},
    }));
    res.json({ success: true, users: formatted });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "patient",
    });

    await notificationModel.create({
      title: "New User Created",
      text: `${user.firstName} ${user.lastName} was registered as ${user.role}.`,
      category: "User",
      priority: "Medium",
    });

    res.json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        isSuspended: user.isSuspended || false,
        joinDate: user.createdAt,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, isSuspended, schedule, specialty } = req.body;
    const updateFields = {};

    if (role !== undefined) updateFields.role = role;
    if (isSuspended !== undefined) updateFields.isSuspended = isSuspended;
    if (schedule !== undefined) updateFields.schedule = schedule;
    if (specialty !== undefined) updateFields.specialty = specialty;

    if (Object.keys(updateFields).length === 0) {
      return res.json({ success: false, message: "No fields to update" });
    }

    const oldUser = await userModel.findById(req.params.id);
    if (!oldUser) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (role !== undefined && role !== oldUser.role) {
      await notificationModel.create({
        title: "User Role Changed",
        text: `${oldUser.firstName} ${oldUser.lastName}'s role was changed from ${oldUser.role} to ${role}.`,
        category: "User",
        priority: "High",
      });
    }
    if (isSuspended !== undefined && isSuspended !== oldUser.isSuspended) {
      await notificationModel.create({
        title: isSuspended ? "User Suspended" : "User Unsuspended",
        text: `${oldUser.firstName} ${oldUser.lastName} was ${isSuspended ? "suspended" : "unsuspended"}.`,
        category: "Security",
        priority: "High",
      });
    }
    if (schedule !== undefined) {
      const activeDays = Object.values(schedule).filter((d) => d?.active).length;
      await notificationModel.create({
        title: "Staff Schedule Updated",
        text: `${oldUser.firstName} ${oldUser.lastName}'s schedule was updated (${activeDays} active day${activeDays !== 1 ? "s" : ""}).`,
        category: "System",
        priority: "Low",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        isSuspended: user.isSuspended || false,
        joinDate: user.createdAt,
        avatar: user.avatar || "",
        specialty: user.specialty || "",
        schedule: user.schedule || {},
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("patientId", "firstName lastName phone email")
      .populate("staffId", "firstName lastName specialty")
      .sort({ date: -1, time: -1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,
      patient: `${a.patientId?.firstName || ""} ${a.patientId?.lastName || ""}`.trim(),
      phone: a.patientId?.phone || "",
      email: a.patientId?.email || "",
      doctor: `Dr. ${a.staffId?.firstName || ""} ${a.staffId?.lastName || ""}`.trim(),
      specialty: a.staffId?.specialty || "",
      department: a.serviceName || a.staffId?.specialty || "General",
      date: a.date,
      time: a.time,
      datetime: `${a.date} ${a.time}`,
      status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
      serviceName: a.serviceName,
    }));

    res.json({ success: true, appointments: formatted });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    const total = appointments.length;

    const confirmed = appointments.filter(a => a.status === "confirmed").length;
    const completed = appointments.filter(a => a.status === "completed").length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const cancelled = appointments.filter(a => a.status === "cancelled").length;
    const completedRate = total > 0 ? ((confirmed + completed) / total * 100).toFixed(1) : 0;

    // By department (serviceName)
    const deptMap = {};
    appointments.forEach(a => {
      const dept = a.serviceName || "General";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const byDepartment = Object.entries(deptMap)
      .map(([name, count]) => ({ name, count, pct: total > 0 ? +((count / total) * 100).toFixed(1) : 0 }))
      .sort((a, b) => b.count - a.count);
    const deptColors = ["#1E3A5F", "#7c3aed", "#22c55e", "#F5C518", "#ea580c", "#ef4444", "#06b6d4", "#ec4899"];
    byDepartment.forEach((d, i) => { d.color = deptColors[i % deptColors.length]; });

    // Monthly trend
    const monthMap = {};
    appointments.forEach(a => {
      if (a.date) {
        const m = a.date.substring(0, 7);
        monthMap[m] = (monthMap[m] || 0) + 1;
      }
    });
    const monthlyTrend = Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Day-of-week distribution
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayMap = {};
    appointments.forEach(a => {
      if (a.date) {
        const day = new Date(a.date + "T00:00:00").getDay();
        dayMap[dayNames[day]] = (dayMap[dayNames[day]] || 0) + 1;
      }
    });
    const peakDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Today's appointments
    const today = new Date().toISOString().split("T")[0];
    const todayCount = appointments.filter(a => a.date === today).length;

    // Attendance rate (non-cancelled / total)
    const attendanceRate = total > 0 ? ((confirmed + completed) / total * 100).toFixed(1) : 0;

    const topDept = byDepartment[0] || { name: "N/A", count: 0, pct: 0 };

    res.json({
      success: true,
      analytics: {
        overview: { total, confirmed, completed, pending, cancelled, completedRate },
        byDepartment,
        monthlyTrend,
        daily: { today: todayCount },
        performance: {
          attendanceRate,
          peakDay,
          topDepartment: topDept,
          totalDepts: byDepartment.length,
        },
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    await appointmentModel.deleteMany({
      $or: [{ patientId: req.params.id }, { staffId: req.params.id }],
    });

    await notificationModel.create({
      title: "User Deleted",
      text: `${user.firstName} ${user.lastName} (${user.role}) was permanently deleted along with all associated appointments.`,
      category: "User",
      priority: "High",
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listUsers, createUser, updateUser, deleteUser, getAllAppointments, getAnalytics };
