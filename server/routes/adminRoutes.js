import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getDashboardOverview,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAppointments,
  getAnalytics,
  getAttendance,
} from "../controllers/adminController.js";
import {
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import {
  getAdminSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import {
  listServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const adminRouter = Router();

adminRouter.use(userAuth, adminAuth);

adminRouter.get("/dashboard", getDashboardOverview);
adminRouter.get("/users", listUsers);
adminRouter.post("/users", createUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/appointments", getAllAppointments);
adminRouter.put("/appointments/:id/status", updateAppointmentStatus);
adminRouter.get("/attendance", getAttendance);
adminRouter.get("/analytics", getAnalytics);
adminRouter.get("/settings", getAdminSettings);
adminRouter.put("/settings", updateSettings);

adminRouter.get("/services", listServices);
adminRouter.post("/services", createService);
adminRouter.put("/services/:id", updateService);
adminRouter.delete("/services/:id", deleteService);

export default adminRouter;
