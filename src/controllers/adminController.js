import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import PC from "../models/PC.js";
import Task from "../models/Task.js";
import Log from "../models/Log.js";
import Notification from "../models/Notification.js";
import { formatResponse } from "../utils/response.js";

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "autolab_jwt_secret";
const JWT_EXP = process.env.JWT_EXP || "8h";

/**
 * @desc Register a new admin
 * @route POST /api/admin/register
 * @access Public
 */
export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res
        .status(400)
        .json(formatResponse(false, "All fields (username, password, name) are required"));
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(409).json(formatResponse(false, "Username already exists"));
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      passwordHash: hash,
      name,
    });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXP }
    );

    res.json(
      formatResponse(true, "Admin registered successfully", {
        _id: admin._id,
        username: admin.username,
        name: admin.name,
        token,
      })
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Login admin
 * @route POST /api/admin/login
 * @access Public
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json(formatResponse(false, "Username and password are required"));
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json(formatResponse(false, "Invalid credentials"));
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json(formatResponse(false, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXP }
    );

    res.json(
      formatResponse(true, "Login successful", {
        _id: admin._id,
        username: admin.username,
        token,
      })
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get logged-in admin profile
 * @route GET /api/admin/profile
 * @access Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-passwordHash");
    if (!admin) {
      return res.status(404).json(formatResponse(false, "Admin not found"));
    }

    res.json(formatResponse(true, "Profile fetched successfully", admin));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get dashboard statistics
 * @route GET /api/admin/stats
 * @access Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalPCs = await PC.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalLogs = await Log.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });

    const stats = {
      totalPCs,
      totalTasks,
      totalLogs,
      unreadNotifications,
    };

    res.json(formatResponse(true, "Dashboard stats", stats));
  } catch (err) {
    next(err);
  }
};
