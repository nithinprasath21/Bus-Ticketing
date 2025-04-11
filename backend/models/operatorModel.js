const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema(
  {
    operatorName: { type: String, required: true },
    contactEmail: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Operator", operatorSchema);
