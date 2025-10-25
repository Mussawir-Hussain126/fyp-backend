import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { formatResponse } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET || "autolab_jwt_secret";
const JWT_EXP = process.env.JWT_EXP || "8h";

export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password) return res.status(400).json(formatResponse(false, "username and password required"));

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(409).json(formatResponse(false, "username exists"));

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, passwordHash: hash, name });
    res.json(formatResponse(true, "admin created", { id: admin._id, username: admin.username }));
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json(formatResponse(false, "invalid credentials"));

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json(formatResponse(false, "invalid credentials"));

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: JWT_EXP });
    res.json(formatResponse(true, "login success", { token }));
  } catch (err) {
    next(err);
  }
};

// Optional: get profile
export const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-passwordHash");
    res.json(formatResponse(true, "profile", admin));
  } catch (err) {
    next(err);
  }
};

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

    res.json(formatResponse(true, "dashboard stats", stats));
  } catch (err) {
    next(err);
  }
};