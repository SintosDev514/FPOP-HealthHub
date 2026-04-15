import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";

import connectDB from "./config/Mongodb.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

connectDB();

/// API ENDPOINTS
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
