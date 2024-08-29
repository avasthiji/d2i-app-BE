const { NotFoundError } = require("../exceptions");
const Attendance = require("../models/Attendance");
const { TABLE_NAMES } = require("../utils/db");
const { getRecordByKey, insertRecord } = require("../utils/QueryBuilder");

module.exports.AttendanceService = {
  punchIn: async (date, user_id) => {
    try {
      let attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });
      if (!attendance) {
        attendance = await insertRecord(TABLE_NAMES.ATTENDANCE, {
          attendanceDate: date,
        });
      }

      // Check if the user already has a record
      const employeeRecord = attendance.employees.find(
        (employee) => employee.user_id.toString() === user_id
      );
      if (employeeRecord) {
        throw new Error(
          "Attendance record already exists for this user on this date."
        );
      }

      // Add the user to the attendance record
      attendance.employees.push({
        user_id,
        isOnLeave: false,
        punchInTime: new Date(),
      });
      await attendance.save();

      return attendance;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },

  punchOut: async (date, user_id) => {
    try {
      const attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });
      if (!attendance) {
        throw new NotFoundError(
          "Attendance record not found for the given date."
        );
      }

      const employeeRecord = attendance.employees.find((employee) => {
        return employee.user_id.toString() === user_id;
      });
      if (!employeeRecord) {
        throw new Error("Employee attendance record not found.");
      }

      if (employeeRecord.punchOutTime) {
        throw new Error("User has already punched out.");
      }
      employeeRecord.punchOutTime = new Date();
      const workingDuration = Math.ceil(
        (employeeRecord.punchOutTime - employeeRecord.punchInTime) / (1000 * 60)
      );
      employeeRecord.workingDuration = workingDuration;

      await attendance.save();

      return attendance;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};
