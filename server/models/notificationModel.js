import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: {
      type: String,
      enum: ["System", "User", "Security", "Alert", "Appointment"],
      default: "System",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const notificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default notificationModel;
