import userModel from "../models/userModel.js";

const listStaff = async (req, res) => {
  try {
    const staff = await userModel.find(
      { role: "staff" },
      "firstName lastName email specialty schedule avatar"
    );
    const formatted = staff.map((s) => ({
      _id: s._id,
      name: `${s.firstName} ${s.lastName}`,
      email: s.email,
      specialty: s.specialty || "",
      schedule: s.schedule || {},
      avatar: s.avatar || "",
    }));
    res.json({ success: true, staff: formatted });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listStaff };
