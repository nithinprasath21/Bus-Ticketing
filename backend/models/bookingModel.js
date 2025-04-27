const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    selectedSeats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);