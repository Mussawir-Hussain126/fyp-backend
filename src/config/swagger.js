// src/config/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AutoLab Backend API",
      version: "1.0.0",
      description: "API documentation for AutoLab FYP (Admin-controlled Lab Management System)",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // all routes will be scanned
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
