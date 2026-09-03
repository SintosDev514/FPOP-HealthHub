import surveyModel from "../models/surveyModel.js";

export const submitSurvey = async (req, res) => {
  const { name, email, contactNumber, satisfaction, appropriateService, facilityResources, providerResponsiveness, suggestions } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Full name is required." });
  }
  if (!email || !String(email).trim()) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }
  if (!satisfaction || !appropriateService || !facilityResources || !providerResponsiveness) {
    return res.status(400).json({ success: false, message: "All ratings are required." });
  }

  try {
    const survey = await surveyModel.create({
      name: String(name).trim(),
      email: String(email).trim(),
      contactNumber: String(contactNumber || "").trim(),
      satisfaction: Number(satisfaction),
      appropriateService: Number(appropriateService),
      facilityResources: Number(facilityResources),
      providerResponsiveness: Number(providerResponsiveness),
      suggestions: String(suggestions || "").trim(),
    });

    return res.json({ success: true, message: "Survey submitted successfully.", survey });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listSurveys = async (req, res) => {
  try {
    const surveys = await surveyModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, surveys });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
