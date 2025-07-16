// app.js - Entry point
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const pgRoutes = require("./routes/pgRoutes");
const guestRoutes = require("./routes/guestRoutes");
const roomRoutes = require("./routes/roomRoutes");
const workerRoutes = require("./routes/workerRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

dotenv.config();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PG Management API",
      version: "1.0.0",
      description: "API for managing PG operations"
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/auth", authRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/wardens", wardenRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/workers", workerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
