import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", sendContactMessage);

export default contactRouter;
