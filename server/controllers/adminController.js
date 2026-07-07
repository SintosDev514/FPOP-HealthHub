import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModels.js";
import notificationModel from "../models/notificationModel.js";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
};

const inRange = (date, start, end) => {
  if (!date) return false;
  const d = new Date(date);
  return !Number.isNaN(d.getTime()) && d >= start && d < end;
};

const getChange = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const countByCreatedAt = (items, start, end) =>
  items.filter((item) => inRange(item.createdAt, start, end)).length;

const getNotificationType = (notification) => {
  const category = (notification.category || "").toLowerCase();
  if (category === "appointment") return "appointment";
  if (category === "user") return "user";
  if (category === "security") return "cancel";
  if (category === "alert") return "report";
  return "done";
};

const getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = addDays(todayStart, 1);
    const todayKey = formatDateKey(now);
    const { start: currentMonthStart, end: nextMonthStart } = getMonthRange(0);
    const { start: previousMonthStart } = getMonthRange(-1);

    const weekStart = startOfDay(now);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekKeys = Array.from({ length: 7 }, (_, index) => formatDateKey(addDays(weekStart, index)));
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const [users, appointments, notifications] = await Promise.all([
      userModel
        .find({}, "role isAccountVerified isSuspended createdAt")
        .lean(),
      appointmentModel
        .find({}, "status date createdAt")
        .lean(),
      notificationModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const totalUsers = users.length;
    const activeAppointments = appointments.filter((a) => ["pending", "confirmed"].includes(a.status)).length;
    const pendingRequests = appointments.filter((a) => a.status === "pending").length;
    const verifiedUsers = users.filter((u) => u.isAccountVerified).length;
    const verifiedRate = totalUsers ? Math.round((verifiedUsers / totalUsers) * 1000) / 10 : 0;

    const currentMonthUsers = countByCreatedAt(users, currentMonthStart, nextMonthStart);
    const previousMonthUsers = countByCreatedAt(users, previousMonthStart, currentMonthStart);
    const currentMonthActive = appointments.filter(
      (a) => ["pending", "confirmed"].includes(a.status) && inRange(a.createdAt, currentMonthStart, nextMonthStart)
    ).length;
    const previousMonthActive = appointments.filter(
      (a) => ["pending", "confirmed"].includes(a.status) && inRange(a.createdAt, previousMonthStart, currentMonthStart)
    ).length;
    const currentMonthPending = appointments.filter(
      (a) => a.status === "pending" && inRange(a.createdAt, currentMonthStart, nextMonthStart)
    ).length;
    const previousMonthPending = appointments.filter(
      (a) => a.status === "pending" && inRange(a.createdAt, previousMonthStart, currentMonthStart)
    ).length;
    const previousMonthVerifiedUsers = users.filter(
      (u) => u.isAccountVerified && inRange(u.createdAt, previousMonthStart, currentMonthStart)
    ).length;
    const currentMonthVerifiedUsers = users.filter(
      (u) => u.isAccountVerified && inRange(u.createdAt, currentMonthStart, nextMonthStart)
    ).length;

    const monthlyGrowth = Array.from({ length: 12 }, (_, index) => {
      const monthStart = new Date(now.getFullYear(), index, 1);
      const monthEnd = new Date(now.getFullYear(), index + 1, 1);
      return {
        month: monthNames[index],
        users: countByCreatedAt(users, monthStart, monthEnd),
        appts: appointments.filter((a) => inRange(a.createdAt, monthStart, monthEnd)).length,
      };
    });

    const weeklyAppointments = weekKeys.map((dateKey, index) => {
      const dayAppointments = appointments.filter((appointment) => appointment.date === dateKey);
      return {
        day: dayLabels[index],
        confirmed: dayAppointments.filter((a) => a.status === "confirmed").length,
        pending: dayAppointments.filter((a) => a.status === "pending").length,
        cancelled: dayAppointments.filter((a) => a.status === "cancelled").length,
      };
    });

    const recentActivity = notifications.slice(0, 5).map((notification) => ({
      id: notification._id,
      user: notification.title,
      action: notification.text,
      time: notification.createdAt,
      type: getNotificationType(notification),
    }));

    const highPriorityUnread = await notificationModel.countDocuments({
      priority: "High",
      read: false,
    });

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalUsers: {
            value: totalUsers,
            change: getChange(currentMonthUsers, previousMonthUsers),
          },
          activeAppointments: {
            value: activeAppointments,
            change: getChange(currentMonthActive, previousMonthActive),
          },
          pendingRequests: {
            value: pendingRequests,
            change: getChange(currentMonthPending, previousMonthPending),
          },
          verifiedUserRate: {
            value: verifiedRate,
            change: getChange(currentMonthVerifiedUsers, previousMonthVerifiedUsers),
          },
        },
        monthlyGrowth,
        weeklyAppointments,
        recentActivity,
        todaySummary: {
          newRegistrations: users.filter((u) => inRange(u.createdAt, todayStart, tomorrowStart)).length,
          appointmentsToday: appointments.filter((a) => a.date === todayKey).length,
          completedSessions: appointments.filter((a) => a.status === "completed" && a.date === todayKey).length,
          pendingReviews: pendingRequests,
        },
        accountSummary: {
          verifiedUsers,
          suspendedUsers: users.filter((u) => u.isSuspended).length,
          staffCount: users.filter((u) => u.role === "staff").length,
          unreadHighPriorityAlerts: highPriorityUnread,
        },
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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

export { getDashboardOverview, listUsers, createUser, updateUser, deleteUser };
