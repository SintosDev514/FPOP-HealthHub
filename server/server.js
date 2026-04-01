import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";

import connectDB from "./config/Mongodb.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

connectDB();

/// API ENDPOINTS
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
