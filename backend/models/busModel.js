const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    busName: { type: String, required: true },
    busNumber: { type: String, required: true },
    busType: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    seats: { type: [String], required: true },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);