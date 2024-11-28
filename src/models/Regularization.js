// models/Regularization.js

const mongoose = require("mongoose");

const RegularizationSchema = new mongoose.Schema({
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  comment: { type: String, required: false },
  submitted_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Regularization = mongoose.model("Regularization", RegularizationSchema);
module.exports = Regularization;
