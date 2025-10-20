import express from "express";
import { listTasks, getTask, updateTaskResult } from "../controllers/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listTasks);
router.get("/:id", authMiddleware, getTask);

// This endpoint could be used by PC agents to POST task results (if secured)
router.post("/:id/result", updateTaskResult);

export default router;
