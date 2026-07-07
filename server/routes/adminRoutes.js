import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAppointments,
} from "../controllers/adminController.js";
import {
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const adminRouter = Router();

adminRouter.use(userAuth, adminAuth);

adminRouter.get("/users", listUsers);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/appointments", getAllAppointments);
adminRouter.put("/appointments/:id/status", updateAppointmentStatus);

export default adminRouter;
