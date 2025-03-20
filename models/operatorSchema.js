const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema({
  operator_name: { type: String, required: true },
  contact_email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Operator", operatorSchema);
