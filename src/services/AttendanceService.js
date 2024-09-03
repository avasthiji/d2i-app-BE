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
          employees:[]
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
      

      const newEmployeeRecord = {
        user_id,
        punchInTime: new Date(),
        punchOutTime:null,
        workingDuration:0,
        timesheet:null,
        isOnLeave:false
      };

      // Add the user to the attendance record
      attendance.employees.push(newEmployeeRecord);
      await attendance.save();

      return {
        attendanceDate:attendance.attendanceDate,
        employees:[
          newEmployeeRecord
        ]
      };
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
        throw new Error(
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

      return {
        attendanceDate:attendance.attendanceDate,
        employees:[employeeRecord],
      };
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },

  getAllRecords: async (date) => {
    try {
      let attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });
      if (!attendance) {
        throw new NotFoundError(
          "Attendance record not found for the given date."
        );
      }
      return attendance;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },

  getMyAttendanceDetails: async (date, user_id) => {
    try {
      let attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });

      if (!attendance) {
        throw new NotFoundError(
          "Attendance record not found for the given date."
        );
      }

      // Find the attendance details for the logged-in user
      const employeeRecord = attendance.employees.find(
        (employee) => employee.user_id.toString() === user_id
      );

      if (!employeeRecord) {
        throw new NotFoundError(
          "Attendance record not found for the user on the given date."
        );
      }

      // Return the user's attendance details
      return {
        attendanceDate: attendance.attendanceDate,
        ...employeeRecord._doc, // This will return all fields within the employee record
      };
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};