import Task from "../models/Task.js";
import Log from "../models/Log.js";
import { formatResponse } from "../utils/response.js";
import { dispatchTaskToAgent } from "../services/automationService.js";

/**
 * @desc List all tasks
 * @route GET /api/tasks
 * @access Private (Admin)
 */
export const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("pc", "name ipAddress")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json(formatResponse(true, "tasks list", tasks));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get a single task by ID
 * @route GET /api/tasks/:id
 * @access Private (Admin)
 */
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("pc", "name ipAddress")
      .populate("createdBy", "username");

    if (!task) return res.status(404).json(formatResponse(false, "task not found"));

    res.json(formatResponse(true, "task found", task));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create a new task for a PC
 * @route POST /api/pcs/:id/command
 * @access Private (Admin)
 */
export const createTaskForPC = async (req, res, next) => {
  try {
    const { command, params } = req.body;
    const pcId = req.params.id;

    // Validate
    if (!command) return res.status(400).json(formatResponse(false, "command required"));

    // Create task
    const task = await Task.create({
      pc: pcId,
      command,
      params,
      createdBy: req.admin?.id,
      status: "pending",
    });

    // Log the action
    await Log.create({
      action: "create_task",
      pc: pcId,
      admin: req.admin?.id,
      details: { command },
    });

    // Try to dispatch task to the PC agent automatically
    await dispatchTaskToAgent(task);

    res.json(formatResponse(true, "task created and dispatched", task));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update task result (called by PC agent after executing command)
 * @route POST /api/tasks/:id/result
 * @access Public (Agent)
 */
export const updateTaskResult = async (req, res, next) => {
  try {
    const { result, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json(formatResponse(false, "task not found"));

    task.result = result || {};
    task.status = status || "success";
    task.updatedAt = new Date();
    await task.save();

    // Log completion
    await Log.create({
      action: "task_result",
      pc: task.pc,
      details: { status: task.status },
    });

    res.json(formatResponse(true, "task updated", task));
  } catch (err) {
    next(err);
  }
};
