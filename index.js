const express = require("express");
const connectDB = require("./db");

// Import Models
const User = require("./models/userSchema");
const Bus = require("./models/busSchema");
const Trip = require("./models/tripSchema");
const Booking = require("./models/bookingSchema");
const Payment = require("./models/paymentSchema");
const Cancellation = require("./models/cancellationSchema");
const Feedback = require("./models/feedbackSchema");
const Operator = require("./models/operatorSchema");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);

// Sample Route
app.get("/", (req, res) => {
  res.send("Bus Ticketing API is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));