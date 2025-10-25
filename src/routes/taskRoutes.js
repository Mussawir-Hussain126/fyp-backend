import express from "express";
import {
  listTasks,
  getTask,
  updateTaskResult,
  createTaskForPC,
} from "../controllers/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// list all tasks
router.get("/", authMiddleware, listTasks);

// single task
router.get("/:id", authMiddleware, getTask);

// create task for a specific PC (dispatched automatically)
router.post("/:id/command", authMiddleware, createTaskForPC);

// update result (used by PC agent)
router.post("/:id/result", updateTaskResult);

export default router;
