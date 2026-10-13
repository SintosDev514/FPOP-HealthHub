import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import transporter from "../config/nodeMailer.js";
import userModel from "../models/userModel.js";

export const SignUp = async (req, res) => {
  const { firstName, lastName, email, password, phone, address, dateOfBirth } = req.body;

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
      phone: phone || "",
      address: address || "",
      dateOfBirth: dateOfBirth || "",
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
      from: `"FPOP HealthHub" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Welcome to FPOP HealthHub",
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px; min-height: 100%;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 59, 111, 0.05); border: 1px solid #E6EFF7;">
      
      <!-- Header -->
      <div style="background-color: #003B6F; padding: 28px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #F5C518;">
        <div style="margin-bottom: 10px;">
          <!-- Shield icon with cross -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 0.5px; vertical-align: middle; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #D1E4F5; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Appointment & Inventory System</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 35px; text-align: center;">
        
        <h3 style="color: #F5C518; font-size: 26px; font-weight: 700; margin: 0 0 18px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">Welcome! 👋</h3>
        
        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">
          Your account has been successfully created in our system. We're glad to have you on board with FPOP HealthHub.
        </p>

        <!-- Email Info Box -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #F5F8FA; border-radius: 10px; padding: 18px; margin-bottom: 24px; border: 1px solid #E6EDF2;">
          <tr>
            <td style="vertical-align: middle; width: 24px; padding-right: 12px; text-align: center;">
              <!-- @ Icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003B6F" stroke-width="2.5" style="display: block;">
                <circle cx="12" cy="12" r="4"/>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
              </svg>
            </td>
            <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; color: #8A9CB0; letter-spacing: 0.8px; text-transform: uppercase;">Registered Email</p>
              <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 700; color: #003B6F;">${email}</p>
            </td>
          </tr>
        </table>

        <!-- Notice Box -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #F5F8FA; border-radius: 10px; padding: 16px; margin-bottom: 28px; border: 1px solid #E6EDF2; border-left: 4px solid #1E293B;">
          <tr>
            <td style="vertical-align: top; width: 20px; padding-right: 12px;">
              <!-- Shield icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#55657E" stroke-width="2.5" style="display: block;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </td>
            <td style="font-size: 13px; color: #55657E; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-style: italic; text-align: left;">
              If you did not create this account, please ignore this email. No further action is required from your side.
            </td>
          </tr>
        </table>  

      </div>

      <!-- Footer -->
      <div style="background-color: #F5F8FA; padding: 24px; text-align: center; border-top: 1px solid #E6EFF7;">
        <div style="margin-bottom: 12px;">
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Privacy Policy</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Contact Support</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Unsubscribe</a>
        </div>
        <p style="margin: 0; font-size: 12px; color: #8A9CB0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          &copy; ${new Date().getFullYear()} FPOP HealthHub. All rights reserved.
        </p>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #A5B6CA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500;">
          FPOP HealthHub • Secure Clinical Communication
        </p>
      </div>

    </div>
  </div>
  `,
    };

    transporter.sendMail(mailOptions).then(() => console.log("Welcome email sent to:", email)).catch((err) => console.error("Welcome email failed:", err.message || err));

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
  const { email, password, rememberMe } = req.body;

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

    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // IMPORTANT in localhost
      sameSite: "lax", // IMPORTANT fix
      maxAge,
    });

    res.json({
      success: true,
      message: "User Login successfully",
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
      },
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

    await user.save({ validateModifiedOnly: true });

    //otp email ine

    const mailOption = {
      from: `"FPOP HealthHub" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "FPOP HealthHub - Account Verification OTP",
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px; min-height: 100%;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 59, 111, 0.05); border: 1px solid #E6EFF7;">
      
      <!-- Header -->
      <div style="background-color: #003B6F; padding: 28px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #F5C518;">
        <div style="margin-bottom: 10px;">
          <!-- Shield icon with cross -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 0.5px; vertical-align: middle; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #D1E4F5; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Secure Account Verification</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 35px; text-align: center;">

        <h3 style="color: #003B6F; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Verify Your Account</h3>
        
        <p style="color: #555555; font-size: 14.5px; line-height: 1.6; margin: 0 0 28px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          Use the One-Time Password (OTP) below to verify your account. This security measure helps verify your identity to protect your medical records.
        </p>

        <!-- OTP Box -->
        <div style="margin: 0 auto 28px auto; max-width: 320px; border: 2px dashed #F5C518; background-color: #FFFDF0; border-radius: 12px; padding: 18px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #003B6F; font-family: Monaco, Consolas, 'Courier New', monospace; padding-left: 8px;">${OTP}</span>
        </div>

        <!-- Info warning box -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #FFFDF0; border-radius: 10px; padding: 16px; margin-bottom: 28px; border: 1px solid #FFF5CC; border-left: 4px solid #F5C518;">
          <tr>
            <td style="vertical-align: top; width: 20px; padding-right: 12px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003B6F" stroke-width="2.5" style="display: block;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </td>
            <td style="font-size: 13px; color: #4B6B94; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">
              This OTP is valid for 10 minutes. Do not share it with anyone. FPOP HealthHub staff will never ask you for this code via phone or email.
            </td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #E6EFF7; margin: 28px 0;" />

        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #8A9CB0; letter-spacing: 1px; text-transform: uppercase;">Need Help?</p>
        <p style="margin: 8px 0 0 0; font-size: 12.5px; color: #6A7B95; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          If you didn't request this verification, please ignore this email or contact security.
        </p>

      </div>

      <!-- Footer -->
      <div style="background-color: #F5F8FA; padding: 24px; text-align: center; border-top: 1px solid #E6EFF7;">
        <div style="margin-bottom: 12px;">
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Privacy Policy</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Contact Support</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Unsubscribe</a>
        </div>
        <p style="margin: 0; font-size: 12px; color: #8A9CB0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          &copy; ${new Date().getFullYear()} FPOP HealthHub. All rights reserved.
        </p>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #A5B6CA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500;">
          FPOP HealthHub • Secure Clinical Communication
        </p>
      </div>

    </div>
  </div>
  `,
    };

    transporter.sendMail(mailOption).then(() => console.log("Verify email sent to:", user.email)).catch((err) => console.error("Verify email failed:", err.message || err));
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

    await user.save({ validateModifiedOnly: true });

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

    await user.save({ validateModifiedOnly: true });

    const mailOption = {
      from: `"FPOP HealthHub" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "FPOP HealthHub - Password Reset OTP",
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 40px 20px; min-height: 100%;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 59, 111, 0.05); border: 1px solid #E6EFF7;">
      
      <!-- Header -->
      <div style="background-color: #003B6F; padding: 28px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #F5C518;">
        <div style="margin-bottom: 10px;">
          <!-- Shield icon with cross -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 0.5px; vertical-align: middle; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">FPOP HealthHub</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #D1E4F5; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Password Reset Request</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 35px; text-align: center;">

        <h3 style="color: #003B6F; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Reset Your Password</h3>
        
        <p style="color: #555555; font-size: 14.5px; line-height: 1.6; margin: 0 0 28px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          Use the One-Time Password (OTP) below to reset your password. This security measure helps verify your identity to protect your medical records.
        </p>

        <!-- OTP Box -->
        <div style="margin: 0 auto 28px auto; max-width: 320px; border: 2px dashed #F5C518; background-color: #FFFDF0; border-radius: 12px; padding: 18px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #003B6F; font-family: Monaco, Consolas, 'Courier New', monospace; padding-left: 8px;">${OTP}</span>
        </div>

        <!-- Info warning box -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #FFFDF0; border-radius: 10px; padding: 16px; margin-bottom: 28px; border: 1px solid #FFF5CC;">
          <tr>
            <td style="vertical-align: top; width: 20px; padding-right: 12px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003B6F" stroke-width="2.5" style="display: block;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </td>
            <td style="font-size: 13px; color: #4B6B94; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">
              This OTP is valid for 15 minutes. Do not share it with anyone. FPOP HealthHub staff will never ask you for this code via phone or email.
            </td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #E6EFF7; margin: 28px 0;" />

        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #8A9CB0; letter-spacing: 1px; text-transform: uppercase;">Need Help?</p>
        <p style="margin: 8px 0 0 0; font-size: 12.5px; color: #6A7B95; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          If you didn't request this change, please ignore this email or contact security.
        </p>

      </div>

      <!-- Footer -->
      <div style="background-color: #F5F8FA; padding: 24px; text-align: center; border-top: 1px solid #E6EFF7;">
        <div style="margin-bottom: 12px;">
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Privacy Policy</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Contact Support</a>
          <span style="color: #CCD6E0; font-size: 12px;">•</span>
          <a href="#" style="color: #003B6F; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Unsubscribe</a>
        </div>
        <p style="margin: 0; font-size: 12px; color: #8A9CB0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          &copy; ${new Date().getFullYear()} FPOP HealthHub. All rights reserved.
        </p>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #A5B6CA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500;">
          FPOP HealthHub • Secure Clinical Communication
        </p>
      </div>

    </div>
  </div>
  `,
    };

    transporter.sendMail(mailOption).then(() => console.log("Reset OTP email sent to:", user.email)).catch((err) => console.error("Reset OTP email failed:", err.message || err));

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

    await user.save({ validateModifiedOnly: true });

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
