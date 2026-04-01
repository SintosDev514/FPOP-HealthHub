import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import transporter from "../config/nodeMailer.js";
import userModel from "../models/userModel.js";

export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
      return res.json({ success: false, message: "Invalid Password" });
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
    res.json({ success: false, message: error.message });
  }
};

////////

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged Out Success" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

////////
