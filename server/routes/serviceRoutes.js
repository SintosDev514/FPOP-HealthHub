import { Router } from "express";
import { getPublicServices } from "../controllers/serviceController.js";

const serviceRouter = Router();

serviceRouter.get("/", getPublicServices);

export default serviceRouter;