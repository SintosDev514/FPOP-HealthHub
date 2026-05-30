import userModel from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel
      .findById(req.user.id)
      .select("firstName lastName email isAccountVerified");

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
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getUserData;
