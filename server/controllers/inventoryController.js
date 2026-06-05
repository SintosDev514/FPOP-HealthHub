import InventoryTable from "../models/inventoryModel.js";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

const computeEnding = (beginning, receipts, issuances) => {
  const rTotal = (receipts || []).reduce((s, v) => s + toNum(v), 0);
  const iTotal = (issuances || []).reduce((s, v) => s + toNum(v), 0);
  return beginning + rTotal - iTotal;
};

export const listTables = async (req, res) => {
  try {
    const tables = await InventoryTable.find().sort({ createdAt: -1 });
    res.json({ success: true, tables });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Table name is required" });
    }
    const table = await InventoryTable.create({
      name: name.trim(),
      createdBy: req.user.id,
    });
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await InventoryTable.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    res.json({ success: true, message: "Table deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Category name is required" });
    }
    const table = await InventoryTable.findById(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    table.categories.push({ name: name.trim(), items: [] });
    await table.save();
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const table = await InventoryTable.findById(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    const cat = table.categories.id(req.params.catId);
    if (!cat) {
      return res.json({ success: false, message: "Category not found" });
    }
    cat.deleteOne();
    await table.save();
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, beginning, receipts, issuances } = req.body;
    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Item name is required" });
    }
    const table = await InventoryTable.findById(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    const cat = table.categories.id(req.params.catId);
    if (!cat) {
      return res.json({ success: false, message: "Category not found" });
    }

    const b = toNum(beginning);
    const rArr = (receipts || []).map(toNum);
    const iArr = (issuances || []).map(toNum);
    const rTotal = rArr.reduce((s, v) => s + v, 0);
    const iTotal = iArr.reduce((s, v) => s + v, 0);
    const ending = b + rTotal - iTotal;

    cat.items.push({
      name: name.trim(),
      beginning: b,
      receipts: [...rArr, rTotal],
      issuances: [...iArr, iTotal],
      ending,
      status: ending <= 0 ? "Low Stock" : "In Stock",
    });
    await table.save();
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { name, beginning, receipts, issuances } = req.body;
    const table = await InventoryTable.findById(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    const cat = table.categories.id(req.params.catId);
    if (!cat) {
      return res.json({ success: false, message: "Category not found" });
    }
    const item = cat.items.id(req.params.itemId);
    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    if (name) item.name = name.trim();
    if (beginning !== undefined) item.beginning = toNum(beginning);
    if (receipts) {
      const rArr = receipts.map(toNum);
      const rTotal = rArr.reduce((s, v) => s + v, 0);
      item.receipts = [...rArr, rTotal];
    }
    if (issuances) {
      const iArr = issuances.map(toNum);
      const iTotal = iArr.reduce((s, v) => s + v, 0);
      item.issuances = [...iArr, iTotal];
    }

    item.ending = computeEnding(
      item.beginning,
      item.receipts.slice(0, -1),
      item.issuances.slice(0, -1)
    );
    item.status = item.ending <= 0 ? "Low Stock" : "In Stock";

    await table.save();
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const table = await InventoryTable.findById(req.params.id);
    if (!table) {
      return res.json({ success: false, message: "Table not found" });
    }
    const cat = table.categories.id(req.params.catId);
    if (!cat) {
      return res.json({ success: false, message: "Category not found" });
    }
    const item = cat.items.id(req.params.itemId);
    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }
    item.deleteOne();
    await table.save();
    res.json({ success: true, table });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
