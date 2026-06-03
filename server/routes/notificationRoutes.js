import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  listNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/", userAuth, adminAuth, listNotifications);
router.put("/read-all", userAuth, adminAuth, markAllRead);
router.put("/:id/read", userAuth, adminAuth, markRead);

export default router;
