const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const errorMiddleware = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const passengerRoutes = require("./routes/passengerRoutes");

const app = express();

if (process.env.NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 10,
    delayMs: () => 500,
  });
  app.use(limiter);
  app.use(speedLimiter);
}

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/operator", operatorRoutes);
app.use("/api/passenger", passengerRoutes);

app.get("/", (req, res) => {
  res.send("Bus Ticketing API is Running...");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
