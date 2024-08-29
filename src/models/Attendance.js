const mongoose = require("mongoose");
const employeeAttendanceSchema = require("./EmployeeAttendance");

const attendanceSchema = new mongoose.Schema({
  attendanceDate: { type: Date },
  employees: [employeeAttendanceSchema],
  isHoliday: { type: Boolean, default: false },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
