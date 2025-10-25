import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  listNotifications,
  createNotification,
  markRead,
  removeNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, listNotifications);
router.post("/", authMiddleware, createNotification);
router.patch("/:id/read", authMiddleware, markRead);
router.delete("/:id", authMiddleware, removeNotification);

export default router;
