import userModel from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      userData: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        dateOfBirth: user.dateOfBirth || "",
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, phone, address, dateOfBirth } = req.body;
    const avatar = req.file ? req.file.path : undefined;

    const updateFields = {};
    if (name !== undefined) {
      const parts = name.trim().split(" ");
      updateFields.firstName = parts[0] || "";
      updateFields.lastName = parts.slice(1).join(" ") || "";
    }
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        dateOfBirth: user.dateOfBirth || "",
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getUserData, updateUserData };
