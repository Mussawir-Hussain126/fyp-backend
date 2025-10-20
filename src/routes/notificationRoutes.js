import express from "express";
import { listNotifications, createNotification } from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listNotifications);
router.post("/", authMiddleware, createNotification);

export default router;
