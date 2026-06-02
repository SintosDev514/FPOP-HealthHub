import mongoose from "mongoose";
import "dotenv/config";
import jwt from "jsonwebtoken";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModels.js";

const test = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Get Marie Santos as staff
  const staffUser = await userModel.findOne({ email: "staff@fpop.com" });
  console.log("Staff ID:", staffUser._id.toString());

  // Generate a token just like the login would
  const token = jwt.sign({ id: staffUser._id.toString() }, process.env.JWT_SECRET);
  console.log("Token generated. Length:", token.length);

  // Now simulate what the route does
  const appointments = await appointmentModel
    .find({ staffId: staffUser._id })
    .populate("patientId", "firstName lastName email phone")
    .sort({ date: -1, time: -1 });

  console.log(`\nResult: ${appointments.length} appointments`);
  appointments.forEach((a) => {
    console.log(`  ${a.date} ${a.time} | ${a.patientId?.firstName} ${a.patientId?.lastName} | ${a.serviceName} | ${a.status}`);
  });

  await mongoose.disconnect();
  process.exit(0);
};

test().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
