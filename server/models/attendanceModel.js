import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: { type: String, required: true },
    timeIn: { type: String, default: "" },
    timeOut: { type: String, default: "" },
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const attendanceModel =
  mongoose.model.attendance || mongoose.model("attendance", attendanceSchema);

export default attendanceModel;