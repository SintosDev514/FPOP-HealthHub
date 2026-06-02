import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import { listStaff } from "../controllers/staffController.js";

const staffRouter = Router();

staffRouter.get("/", userAuth, listStaff);

export default staffRouter;
