import settingsModel from "../models/settingsModel.js";

const toPublic = (settings) => ({
  clinicName: settings.clinicName,
  clinicEmail: settings.clinicEmail,
  clinicPhone: settings.clinicPhone,
  clinicAddress: settings.clinicAddress,
});

export const getPublicSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne({});
    if (!settings) {
      settings = await settingsModel.create({});
    }
    return res.json({ success: true, settings: toPublic(settings) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminSettings = async (req, res) => {
  return getPublicSettings(req, res);
};

export const updateSettings = async (req, res) => {
  try {
    const { clinicName, clinicEmail, clinicPhone, clinicAddress } = req.body;
    let settings = await settingsModel.findOne({});
    if (!settings) settings = new settingsModel({});
    if (clinicName !== undefined) settings.clinicName = String(clinicName).trim();
    if (clinicEmail !== undefined) settings.clinicEmail = String(clinicEmail).trim();
    if (clinicPhone !== undefined) settings.clinicPhone = String(clinicPhone).trim();
    if (clinicAddress !== undefined) settings.clinicAddress = String(clinicAddress).trim();
    await settings.save();
    return res.json({ success: true, settings: toPublic(settings) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
