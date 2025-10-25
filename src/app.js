import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import adminRoutes from "./routes/adminRoutes.js";
import pcRoutes from "./routes/pcRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/pcs", pcRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/notifications", notificationRoutes);

//swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handler (should be after routes)
app.use(errorMiddleware);

export default app;
