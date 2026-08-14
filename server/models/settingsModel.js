import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: "FPOP Family Planning Clinic" },
    clinicEmail: { type: String, default: "info@fpop-clinic.org" },
    clinicPhone: { type: String, default: "+63 2 8123 4567" },
    clinicAddress: { type: String, default: "123 Brand Street, Manila, Philippines" },
  },
  { timestamps: true }
);

const settingsModel =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default settingsModel;
