import mongoose from "mongoose";
import "dotenv/config";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModels.js";

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const staffUser = await userModel.findOne({ email: "staff@fpop.com" });
  console.log("Staff user ID:", staffUser._id.toString());

  const appointments = await appointmentModel
    .find({ staffId: staffUser._id })
    .populate("patientId", "firstName lastName email phone")
    .sort({ date: -1, time: -1 });

  console.log(`Found ${appointments.length} appointments`);
  appointments.forEach((a) => {
    const name = a.patientId
      ? `${a.patientId.firstName || "?"} ${a.patientId.lastName || "?"}`
      : "NO PATIENT DATA";
    console.log(`  ${a.date} ${a.time} - ${name} - ${a.serviceName} - ${a.status}`);
  });

  await mongoose.disconnect();
  process.exit(0);
};

check();
