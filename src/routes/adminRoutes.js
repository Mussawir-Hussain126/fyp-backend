import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and authentication
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.json({ message: "Login successful", token: "mocked-token" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get lab statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of lab stats
 */
router.get("/stats", (req, res) => {
  res.json({
    totalPCs: 15,
    activeTasks: 3,
    pendingUpdates: 2,
  });
});

export default router;
