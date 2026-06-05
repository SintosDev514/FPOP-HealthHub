import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  beginning: { type: Number, default: 0 },
  receipts: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  issuances: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ending: { type: Number, default: 0 },
  status: { type: String, default: "In Stock" },
});

const inventoryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [inventoryItemSchema],
});

const inventoryTableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    chapter: { type: String, default: "" },
    quarter: { type: String, default: "" },
    year: { type: String, default: "" },
    categories: [inventoryCategorySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryTable ||
  mongoose.model("InventoryTable", inventoryTableSchema);
