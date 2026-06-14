import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

import userModel from "./models/userModel.js";

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "staff@fpop.com";
    const existing = await userModel.findOne({ email });
    if (existing) {
      console.log("Staff account already exists:");
      console.log(`  Name: ${existing.firstName} ${existing.lastName}`);
      console.log(`  Email: ${existing.email}`);
      console.log(`  Role: ${existing.role}`);
      console.log(`  Specialty: ${existing.specialty || "(not set)"}`);
      await mongoose.disconnect();
      return;
    }

    const hashPassword = await bcrypt.hash("staff123", 10);

    const staff = await userModel.create({
      firstName: "Marie",
      lastName: "Santos",
      email,
      password: hashPassword,
      role: "staff",
      phone: "+63 912 345 6789",
      address: "123 Health St, Manila",
      specialty: "General Consultation",
      schedule: {
        "0": { active: false, start: "09:00", end: "17:00" },
        "1": { active: true, start: "08:00", end: "17:00" },
        "2": { active: true, start: "08:00", end: "17:00" },
        "3": { active: true, start: "08:00", end: "17:00" },
        "4": { active: true, start: "08:00", end: "17:00" },
        "5": { active: true, start: "08:00", end: "17:00" },
        "6": { active: false, start: "09:00", end: "12:00" },
      },
    });

    console.log("Staff account created!");
    console.log(`  Name: ${staff.firstName} ${staff.lastName}`);
    console.log(`  Email: ${staff.email}`);
    console.log(`  Password: staff123`);
    console.log(`  Role: ${staff.role}`);
    console.log(`  Specialty: ${staff.specialty}`);
    console.log(`  Schedule: Mon-Fri 8AM-5PM`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedStaff();
