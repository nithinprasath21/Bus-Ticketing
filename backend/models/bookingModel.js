const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    selectedSeats: [
      {
        seatNumber: { type: String, required: true },
        status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
        cancelledAt: { type: Date, default: null }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);