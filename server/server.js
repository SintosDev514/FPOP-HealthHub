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
import inventoryRouter from "./routes/inventoryRoutes.js";

import connectDB from "./config/Mongodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());

connectDB();

/// API ENDPOINTS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/staff", staffRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/notifications", notificationRouter);
app.use("/api/inventory", inventoryRouter);

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
