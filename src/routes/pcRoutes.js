import express from "express";
import { getAllPCs, createPC, getPC, sendCommandToPC } from "../controllers/pcController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllPCs);
router.post("/", authMiddleware, createPC);
router.get("/:id", authMiddleware, getPC);
router.post("/:id/command", authMiddleware, sendCommandToPC);

export default router;
