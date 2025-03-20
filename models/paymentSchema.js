const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  payment_method: { type: String, required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, unique: true, required: true },
  payment_status: { type: String, enum: ["completed", "failed", "pending"], default: "pending" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
