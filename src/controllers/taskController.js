import PC from "../models/PC.js";
import Task from "../models/Task.js";
import Log from "../models/Log.js";
import { formatResponse } from "../utils/response.js";

// list PCs
export const getAllPCs = async (req, res, next) => {
  try {
    const pcs = await PC.find().sort({ name: 1 });
    res.json(formatResponse(true, "pcs list", pcs));
  } catch (err) {
    next(err);
  }
};

// create / register a PC (Admin can add)
export const createPC = async (req, res, next) => {
  try {
    const { name, ipAddress, macAddress, os } = req.body;
    const pc = await PC.create({ name, ipAddress, macAddress, os, status: "unknown" });
    await Log.create({ action: "create_pc", pc: pc._id, admin: req.admin?.id, details: { name, ipAddress } });
    res.json(formatResponse(true, "pc created", pc));
  } catch (err) {
    next(err);
  }
};

// get single pc
export const getPC = async (req, res, next) => {
  try {
    const pc = await PC.findById(req.params.id);
    if (!pc) return res.status(404).json(formatResponse(false, "pc not found"));
    res.json(formatResponse(true, "pc", pc));
  } catch (err) {
    next(err);
  }
};

// send command (creates a Task)
export const sendCommandToPC = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { command, params } = req.body;
    const pc = await PC.findById(id);
    if (!pc) return res.status(404).json(formatResponse(false, "pc not found"));

    const task = await Task.create({ pc: pc._id, command, params, createdBy: req.admin?.id });
    await Log.create({ action: "send_command", pc: pc._id, admin: req.admin?.id, details: { command, taskId: task._id } });

    // NOTE: actual delivery to PC agent is handled by automationService (separate)
    res.json(formatResponse(true, "command queued", { taskId: task._id }));
  } catch (err) {
    next(err);
  }
};
