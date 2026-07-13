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

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠ RESEND_API_KEY is not set - emails will not work");
}
if (!process.env.SENDER_EMAIL) {
  console.warn("⚠ SENDER_EMAIL is not set - emails will not work");
}

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
