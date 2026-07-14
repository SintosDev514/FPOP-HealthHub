import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      enum: ["fp", "hiv"],
      required: true,
    },
    clientFirstName: { type: String, default: "" },
    clientLastName: { type: String, default: "" },
    clientId: { type: String, default: "" },
    formData: { type: mongoose.Schema.Types.Mixed, required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

assessmentSchema.index({ clientLastName: 1, clientFirstName: 1 });
assessmentSchema.index({ submittedAt: -1 });
assessmentSchema.index({ formType: 1 });

const assessmentModel =
  mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);

export default assessmentModel;
