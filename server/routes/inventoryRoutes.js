import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import {
  listTables,
  createTable,
  deleteTable,
  addCategory,
  deleteCategory,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";

const inventoryRouter = Router();

inventoryRouter.use(userAuth);

inventoryRouter.get("/tables", listTables);
inventoryRouter.post("/tables", createTable);
inventoryRouter.delete("/tables/:id", deleteTable);

inventoryRouter.post("/tables/:id/categories", addCategory);
inventoryRouter.delete("/tables/:id/categories/:catId", deleteCategory);

inventoryRouter.post("/tables/:id/categories/:catId/items", addItem);
inventoryRouter.put("/tables/:id/categories/:catId/items/:itemId", updateItem);
inventoryRouter.delete("/tables/:id/categories/:catId/items/:itemId", deleteItem);

export default inventoryRouter;
