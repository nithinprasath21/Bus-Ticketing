const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Bus Ticketing API is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
