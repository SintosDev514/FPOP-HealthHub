import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Login Again.",
      });
    }

    // 🔥 FETCH FULL USER FROM DB
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // attach full user
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};

export default userAuth;
