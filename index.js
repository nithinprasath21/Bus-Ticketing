const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passengerRoutes = require("./routes/passengerRoutes");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/passengers", passengerRoutes);

app.get("/", (req, res) => {
  res.send("Bus Ticketing API is Running...");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
