const mongoose = require("mongoose");

const secureMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const SecureMessage = new mongoose.model("SecureMessage", secureMessageSchema);
module.exports = SecureMessage;
