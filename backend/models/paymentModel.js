const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: { type: String, enum: ["card", "upi", "wallet", "netbanking"], required: true },
    status: { type: String, enum: ["created", "processing", "successful", "failed"], default: "created" },
    provider: { type: String, enum: ["razorpay", "stripe"], required: true },
    providerOrderId: { type: String, required: true },
    providerPaymentId: { type: String },
    providerSignature: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
