import express from "express";
import {
  createPC,
  getAllPCs,
  getPC,
  updatePC,
  deletePC,
  sendCommandToPC,
} from "../controllers/pcController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Correct order matters
router.post("/", authMiddleware, createPC);
router.get("/", authMiddleware, getAllPCs);
router.get("/:id", authMiddleware, getPC);
router.put("/:id", authMiddleware, updatePC);  // <== THIS one
router.delete("/:id", authMiddleware, deletePC);
router.post("/:id/command", authMiddleware, sendCommandToPC);

export default router;
