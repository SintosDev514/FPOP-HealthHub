import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, default: "" },
    satisfaction: { type: Number, required: true },
    appropriateService: { type: Number, required: true },
    facilityResources: { type: Number, required: true },
    providerResponsiveness: { type: Number, required: true },
    suggestions: { type: String, default: "" },
  },
  { timestamps: true }
);

const surveyModel = mongoose.model.survey || mongoose.model("survey", surveySchema);

export default surveyModel;
