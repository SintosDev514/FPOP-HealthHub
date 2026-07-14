import assessmentModel from "../models/assessmentModel.js";

export const createAssessment = async (req, res) => {
  try {
    const { formType, clientFirstName, clientLastName, clientId, formData } =
      req.body;

    if (!formType || !formData) {
      return res.status(400).json({
        success: false,
        message: "formType and formData are required",
      });
    }

    const assessment = await assessmentModel.create({
      formType,
      clientFirstName: clientFirstName || "",
      clientLastName: clientLastName || "",
      clientId: clientId || "",
      formData,
      submittedBy: req.user?.id || null,
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    console.error("Failed to create assessment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAssessments = async (req, res) => {
  try {
    const { search, formType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (formType && formType !== "all") {
      query.formType = formType;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { clientFirstName: regex },
        { clientLastName: regex },
        { clientId: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await assessmentModel.countDocuments(query);
    const assessments = await assessmentModel
      .find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-formData")
      .lean();

    res.json({
      success: true,
      assessments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Failed to list assessments:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessment = async (req, res) => {
  try {
    const assessment = await assessmentModel.findById(req.params.id).lean();
    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }
    res.json({ success: true, assessment });
  } catch (error) {
    console.error("Failed to get assessment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
