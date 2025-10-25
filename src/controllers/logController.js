import Log from "../models/Log.js";
import PC from "../models/PC.js";
import Admin from "../models/Admin.js";
import { formatResponse } from "../utils/response.js";

/**
 * @desc List all logs in reverse chronological order
 * @route GET /api/logs
 * @access Private (Admin)
 */
export const listLogs = async (req, res, next) => {
  try {
    const logs = await Log.find()
      .populate("pc", "name ipAddress")
      .populate("admin", "username name")
      .sort({ timestamp: -1 });

    res.json(formatResponse(true, "logs list", logs));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get logs for a specific PC
 * @route GET /api/logs/pc/:pcId
 * @access Private (Admin)
 */
export const getLogsByPC = async (req, res, next) => {
  try {
    const { pcId } = req.params;
    const pc = await PC.findById(pcId);
    if (!pc) return res.status(404).json(formatResponse(false, "PC not found"));

    const logs = await Log.find({ pc: pcId })
      .populate("admin", "username name")
      .sort({ timestamp: -1 });

    res.json(formatResponse(true, `logs for PC ${pc.name}`, logs));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get logs for a specific admin
 * @route GET /api/logs/admin/:adminId
 * @access Private (Admin)
 */
export const getLogsByAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json(formatResponse(false, "Admin not found"));

    const logs = await Log.find({ admin: adminId })
      .populate("pc", "name ipAddress")
      .sort({ timestamp: -1 });

    res.json(formatResponse(true, `logs for admin ${admin.username}`, logs));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create a manual log entry
 * @route POST /api/logs
 * @access Private (Admin)
 */
export const createLog = async (req, res, next) => {
  try {
    const { action, pc, details } = req.body;
    if (!action) return res.status(400).json(formatResponse(false, "action required"));

    const log = await Log.create({
      action,
      pc,
      admin: req.admin?.id,
      details,
    });

    res.json(formatResponse(true, "log created", log));
  } catch (err) {
    next(err);
  }
};
