const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const passengerRoutes = require("./routes/passengerRoutes");

const app = express();
app.use(express.json());
app.use(cors());

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
