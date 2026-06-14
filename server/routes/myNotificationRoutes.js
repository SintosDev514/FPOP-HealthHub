import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import {
  myNotifications,
  myMarkRead,
  myMarkAllRead,
} from "../controllers/myNotificationController.js";

const router = Router();

router.get("/", userAuth, myNotifications);
router.put("/read-all", userAuth, myMarkAllRead);
router.put("/:id/read", userAuth, myMarkRead);

export default router;
