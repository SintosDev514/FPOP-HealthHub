import serviceModel from "../models/serviceModel.js";

const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getPublicServices = async (req, res) => {
  try {
    const services = await serviceModel.find({}).lean();
    return res.json({ success: true, services });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listServices = async (req, res) => {
  try {
    const services = await serviceModel.find({}).sort({ name: 1 }).lean();
    return res.json({ success: true, services });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Service name is required" });
    }
    const cleanName = String(name).trim();
    const slug = toSlug(cleanName);
    const existing = await serviceModel.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "A service with this name already exists" });
    }
    const service = await serviceModel.create({
      name: cleanName,
      slug,
      category: category || "family-planning",
    });
    return res.status(201).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, category } = req.body;
    const service = await serviceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    if (name !== undefined && String(name).trim()) {
      const cleanName = String(name).trim();
      if (cleanName !== service.name) {
        const slug = toSlug(cleanName);
        const dup = await serviceModel.findOne({ slug, _id: { $ne: service._id } });
        if (dup) {
          return res.status(400).json({ success: false, message: "A service with this name already exists" });
        }
        service.name = cleanName;
        service.slug = slug;
      }
    }
    if (category !== undefined) service.category = category;
    await service.save();
    return res.json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await serviceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    return res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};