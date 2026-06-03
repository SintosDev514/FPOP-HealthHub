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

export { listUsers, createUser, updateUser, deleteUser };
