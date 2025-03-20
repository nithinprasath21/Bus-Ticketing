const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  operator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departure_time: { type: Date, required: true },
  arrival_time: { type: Date, required: true },
  price: { type: Number, required: true },
  available_seats: { type: [String], required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trip", tripSchema);
