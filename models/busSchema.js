const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  operator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus_name: { type: String, required: true },
  bus_type: { type: String, required: true }, // AC, Sleeper, etc.
  total_seats: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bus", busSchema);
