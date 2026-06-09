import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getAvailableSlots,
  createAppointment,
  getUserAppointments,
  getStaffAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const appointmentRouter = Router();

appointmentRouter.get("/", userAuth, getUserAppointments);
appointmentRouter.get("/slots", userAuth, getAvailableSlots);
appointmentRouter.get("/staff", userAuth, getStaffAppointments);
appointmentRouter.post("/", userAuth, createAppointment);
appointmentRouter.put("/:id/status", userAuth, updateAppointmentStatus);

export default appointmentRouter;
