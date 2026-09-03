import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import staffRouter from "./routes/staffRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import myNotificationRouter from "./routes/myNotificationRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import assessmentRouter from "./routes/assessmentRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import surveyRouter from "./routes/surveyRoutes.js";
import { getPublicSettings } from "./controllers/settingsController.js";

import connectDB from "./config/Mongodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());

connectDB();

/// API ENDPOINTS

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/staff", staffRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/notifications", notificationRouter);
app.use("/api/notifications", myNotificationRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/assessments", assessmentRouter);
app.use("/api/contact", contactRouter);
app.use("/api/surveys", surveyRouter);
app.get("/api/settings", getPublicSettings);

import mailer from "./config/nodeMailer.js";

const emailVars = ["EMAILJS_SERVICE_ID", "EMAILJS_TEMPLATE_ID", "EMAILJS_PUBLIC_KEY"];
const missing = emailVars.filter((v) => !process.env[v]);
if (missing.length) {
  console.warn("⚠ Missing email env vars:", missing.join(", "));
} else {
  console.log("EMAIL CONFIG: All EmailJS env vars set");
}

app.get("/api/test-email", async (req, res) => {
  const testTo = req.query.to;
  if (!testTo) {
    return res.status(400).json({ error: "Add ?to=some@email.com" });
  }
  try {
    await mailer.sendMail({
      to: testTo,
      subject: "FPOP HealthHub - Test Email",
      html: "<h1>It works!</h1><p>Your EmailJS email system is configured correctly.</p>",
    });
    console.log("TEST EMAIL SUCCESS sent to:", testTo);
    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("TEST EMAIL FAILED:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
