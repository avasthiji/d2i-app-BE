const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaveStart: { type: Date, required: true },
  leaveEnd: { type: Date, required: true },
  leaveType: {
    type: String,
    enum: ["casual", "earned", "maternity", "paternity", "sick"],
    required: true,
  },
  dayType: {
    type: Number,
    enum: [0.5, 1],
    required: true,
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Leave = mongoose.model("Leave", LeaveSchema);
module.exports = Leave;
