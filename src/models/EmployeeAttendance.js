const mongoose = require("mongoose");

const employeeAttendanceSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    punchInTime: { type: Date, default: null },
    punchOutTime: { type: Date, default: null },
    workingDuration: { type: Number, default: 0 },
    isOnLeave: { type: Boolean, default: true },
  },
  { _id: false }
);

module.exports = employeeAttendanceSchema;
