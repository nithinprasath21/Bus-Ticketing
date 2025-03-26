const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, unique: true, required: true },
    paymentStatus: { type: String, enum: ["completed", "failed", "pending"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
