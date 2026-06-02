import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("appointment", appointmentSchema);
