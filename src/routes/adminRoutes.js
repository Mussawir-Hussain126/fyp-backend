import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getProfile,
  getDashboardStats,
} from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/admin/register
 * @desc    Register a new admin account
 * @access  Public
 */
router.post("/register", registerAdmin);

/**
 * @route   POST /api/admin/login
 * @desc    Login and receive JWT token
 * @access  Public
 */
router.post("/login", loginAdmin);

/**
 * @route   GET /api/admin/profile
 * @desc    Get admin profile using token
 * @access  Private (requires JWT)
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @route   GET /api/admin/stats
 * @desc    Fetch overall dashboard stats (PC count, task count, logs, etc.)
 * @access  Private (requires JWT)
 */
router.get("/stats", authMiddleware, getDashboardStats);

export default router;
