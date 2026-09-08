import { Router } from "express";
import { submitSurvey, listSurveys } from "../controllers/surveyController.js";

const router = Router();

router.post("/", submitSurvey);
router.get("/", listSurveys);

export default router;
