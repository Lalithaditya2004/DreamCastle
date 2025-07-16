// app.js - Entry point
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerroutes");
const wardenRoutes = require("./routes/wardenroutes");
const pgRoutes = require("./routes/pgroutes");
const guestRoutes = require("./routes/guestroutes");
const roomRoutes = require("./routes/roomroutes");
const workerRoutes = require("./routes/workerroutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// app.use("/api/auth", authRoutes);
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
