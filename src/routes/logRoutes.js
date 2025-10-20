import express from "express";
import { listLogs } from "../controllers/logController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, listLogs);
export default router;
