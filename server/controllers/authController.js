import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import transporter from "../config/nodeMailer.js";
import userModel from "../models/userModel.js";

export const SignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //EMAIL SENDER
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to FPOP HealthHub",
      html: `
    <div style="margin:0; padding:0; background-color:#f2f6fc; font-family: Arial, sans-serif;">
      
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">
            
            <!-- Container -->
            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#1e88e5; padding:20px; text-align:center;">
                  <h2 style="color:#ffffff; margin:0;">
                    FPOP HealthHub
                  </h2>
                  <p style="color:#e3f2fd; margin:5px 0 0; font-size:14px;">
                    Appointment & Inventory System
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  
                  <h3 style="color:#1e88e5; margin-top:0;">
                    Welcome! 👋
                  </h3>

                  <p style="color:#555; font-size:15px;">
                    Your account has been successfully created in our system.
                  </p>

                  <p style="font-size:15px; color:#333;">
                    <strong>Email:</strong> ${email}
                  </p>

                  

                  <p style="color:#777; font-size:13px;">
                    If you did not create this account, please ignore this email.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f2f6fc; text-align:center; padding:15px; font-size:12px; color:#888;">
                  © 2026 FPOP HealthHub. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////

export const SignIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User Login successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

////////

export const SendVerifyEmailOtp = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = OTP;
    user.verifyOtpExpAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    //otp email ine

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "FPOP HealthHub - Account Verification OTP",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #1e88e5; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">FPOP HealthHub</h2>
        <p style="margin: 5px 0 0; font-size: 14px;">Secure Account Verification</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px; text-align: center;">
        <h3 style="color: #333;">Verify Your Account</h3>
        <p style="color: #555; font-size: 14px;">
          Use the One-Time Password (OTP) below to verify your account.
        </p>

        <!-- OTP Box -->
        <div style="margin: 20px 0;">
          <span style="display: inline-block; padding: 15px 25px; font-size: 24px; letter-spacing: 5px; color: #1e88e5; border: 2px dashed #1e88e5; border-radius: 8px;">
            ${OTP}
          </span>
        </div>

        <p style="color: #777; font-size: 12px;">
          This OTP is valid for a limited time. Do not share it with anyone.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} FPOP HealthHub. All rights reserved.
      </div>

    </div>
  </div>
  `,
    };

    await transporter.sendMail(mailOption);
    res
      .status(200)
      .json({ success: true, message: "Verification sent Successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

///////

export const VerifyEmail = async (req, res) => {
  const { OTP } = req.body;
  const userId = req.user?.id;

  if (!userId || !OTP) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.verifyOtp || user.verifyOtp !== OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.verifyOtpExpAt || user.verifyOtpExpAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email Verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//////////

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

////////////

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = OTP;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "FPOP HealthHub - Password Reset OTP",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #e53935; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">FPOP HealthHub</h2>
        <p style="margin: 5px 0 0; font-size: 14px;">Password Reset Request</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px; text-align: center;">
        <h3 style="color: #333;">Reset Your Password</h3>
        <p style="color: #555; font-size: 14px;">
          Use the One-Time Password (OTP) below to reset your password.
        </p>

        <!-- OTP Box -->
        <div style="margin: 20px 0;">
          <span style="display: inline-block; padding: 15px 25px; font-size: 24px; letter-spacing: 5px; color: #e53935; border: 2px dashed #e53935; border-radius: 8px;">
            ${OTP}
          </span>
        </div>

        <p style="color: #777; font-size: 12px;">
          This OTP is valid for 15 minutes. Do not share it with anyone.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} FPOP HealthHub. All rights reserved.
      </div>

    </div>
  </div>
  `,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

////////////

export const resetPassword = async (req, res) => {
  const { newPassword, OTP, email } = req.body;

  if (!email || !OTP || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and New Password are required.",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || user.resetOtp !== OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
