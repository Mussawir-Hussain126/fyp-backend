import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

import adminRoutes from "./src/routes/adminRoutes.js";
import pcRoutes from "./src/routes/pcRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import logRoutes from "./src/routes/logRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/pcs", pcRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
