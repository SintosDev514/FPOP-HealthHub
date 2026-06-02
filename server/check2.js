import mongoose from "mongoose";
import "dotenv/config";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModels.js";

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const patientIds = ["6a1a55cc3ae45179946e833e", "6a1bfb0165fedfdbfa36e39f"];
  for (const pid of patientIds) {
    const user = await userModel.findById(pid, "firstName lastName email");
    console.log(`Patient ${pid}:`, user ? `${user.firstName} ${user.lastName}` : "NOT FOUND");
  }

  const appointments = await appointmentModel
    .find({ staffId: "6a1e4552593c0ab1df73223d" })
    .populate("patientId", "firstName lastName");
  console.log("\nPopulated appointments:");
  console.log(JSON.stringify(appointments, null, 2));

  await mongoose.disconnect();
  process.exit(0);
};

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
