import mongoose from "mongoose";
import "dotenv/config";

import serviceModel from "../models/serviceModel.js";

const SERVICES = [
  { slug: "counseling-consultation", name: "Counseling / Consultation", category: "family-planning" },
  { slug: "oral-contraceptives", name: "Oral Contraceptives", category: "family-planning" },
  { slug: "combined-oral-contraceptive", name: "Combined Oral Contraceptive (COC)", category: "family-planning" },
  { slug: "lady-pill-trust-althea", name: "Lady Pill / Trust / Althea", category: "family-planning" },
  { slug: "progestin-only-pill", name: "Progestin-Only Pill (POP)", category: "family-planning" },
  { slug: "injectable", name: "Injectable (1 Month / 3 Months)", category: "family-planning" },
  { slug: "iud", name: "IUD (Insertion / Removal)", category: "family-planning" },
  { slug: "implant", name: "Implant (PSI)", category: "family-planning" },
  { slug: "condom", name: "Condom", category: "family-planning" },
  { slug: "awareness-counseling", name: "Awareness & Counseling", category: "sti-hiv" },
  { slug: "community-based-screening", name: "Community-Based Screening (HIV Testing)", category: "sti-hiv" },
  { slug: "asrh", name: "Adolescent Sexual Reproductive Health (ASRH)", category: "asrh" },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const service of SERVICES) {
      await serviceModel.updateOne(
        { slug: service.slug },
        { $setOnInsert: service },
        { upsert: true }
      );
    }

    const count = await serviceModel.countDocuments();
    console.log(`Seed complete: ${count} services total`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedServices();