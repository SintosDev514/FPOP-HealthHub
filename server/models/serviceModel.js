import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      enum: ["family-planning", "sti-hiv", "asrh"],
      default: "family-planning",
    },
  },
  { timestamps: true }
);

const serviceModel =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default serviceModel;