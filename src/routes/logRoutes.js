import express from "express";
import {
  listLogs,
  getLogsByPC,
  getLogsByAdmin,
  createLog,
} from "../controllers/logController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listLogs);
router.get("/pc/:pcId", authMiddleware, getLogsByPC);
router.get("/admin/:adminId", authMiddleware, getLogsByAdmin);
router.post("/", authMiddleware, createLog);

export default router;
