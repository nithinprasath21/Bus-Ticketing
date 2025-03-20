const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  selected_seats: { type: [String], required: true },
  total_price: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "canceled", "pending"], default: "confirmed" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
