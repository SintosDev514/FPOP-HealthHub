import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createAssessment,
  listAssessments,
  getAssessment,
  deleteAssessment,
} from "../controllers/assessmentController.js";

const assessmentRouter = Router();

assessmentRouter.use(userAuth);

assessmentRouter.post("/", createAssessment);
assessmentRouter.get("/", listAssessments);
assessmentRouter.get("/:id", getAssessment);
assessmentRouter.delete("/:id", deleteAssessment);

export default assessmentRouter;
