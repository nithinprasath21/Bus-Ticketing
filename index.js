const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const operatorRoutes = require("./routes/operatorRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/operators", operatorRoutes);

// Sample Route
app.get("/", (req, res) => {
  res.send("Bus Ticketing API is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
