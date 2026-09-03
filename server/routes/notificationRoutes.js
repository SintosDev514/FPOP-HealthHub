import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/", userAuth, adminAuth, listNotifications);
router.put("/read-all", userAuth, adminAuth, markAllRead);
router.delete("/clear-all", userAuth, adminAuth, clearAll);
router.put("/:id/read", userAuth, adminAuth, markRead);
router.delete("/:id", userAuth, adminAuth, deleteNotification);

export default router;
