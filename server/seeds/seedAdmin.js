import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

import userModel from "../models/userModel.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "fpophealthhub@gmail.com";
    const existing = await userModel.findOne({ email });
    if (existing) {
      console.log("Admin account already exists:");
      console.log(`  Name: ${existing.firstName} ${existing.lastName}`);
      console.log(`  Email: ${existing.email}`);
      console.log(`  Role: ${existing.role}`);
      await mongoose.disconnect();
      return;
    }

    const hashPassword = await bcrypt.hash("admin123", 10);

    const admin = await userModel.create({
      firstName: "FPOP",
      lastName: "Admin",
      email,
      password: hashPassword,
      role: "admin",
      isAccountVerified: true,
      phone: "",
      address: "",
    });

    console.log("Admin account created!");
    console.log(`  Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123`);
    console.log(`  Role: ${admin.role}`);
    console.log(`  Verified: ${admin.isAccountVerified}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
