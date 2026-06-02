import mongoose from "mongoose";
import "dotenv/config";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModels.js";

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("--- STAFF USERS ---");
  const staff = await userModel.find({ role: "staff" }, "firstName lastName email _id");
  console.log(JSON.stringify(staff, null, 2));

  console.log("\n--- ALL APPOINTMENTS ---");
  const appointments = await appointmentModel.find({});
  console.log(JSON.stringify(appointments, null, 2));

  if (staff.length > 0 && appointments.length > 0) {
    const staffId = staff[0]._id.toString();
    console.log(`\n--- MATCHING: staffId=${staffId} ---`);
    const matching = await appointmentModel.find({ staffId: staff[0]._id });
    console.log(JSON.stringify(matching, null, 2));
  }

  await mongoose.disconnect();
  process.exit(0);
};

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
