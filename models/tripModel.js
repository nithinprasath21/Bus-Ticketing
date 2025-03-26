const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
