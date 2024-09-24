const { json } = require("express");
const { NotFoundError, BadRequestError } = require("../exceptions");
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
          employees: [],
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
        punchOutTime: null,
        workingDuration: 0,
        timesheet: null,
        isOnLeave: false,
      };

      // Add the user to the attendance record
      attendance.employees.push(newEmployeeRecord);
      await attendance.save();

      return {
        attendanceDate: attendance.attendanceDate,
        employees: [newEmployeeRecord],
      };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },

  punchOut: async (date, user_id, timesheet) => {
    try {
      const attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });
      if (!attendance) {
        return {
          attendanceDate: date,
          employees: null,
        };
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
      if (timesheet) {
        employeeRecord.timesheet = timesheet;
      }

      await attendance.save();

      return {
        attendanceDate: attendance.attendanceDate,
        employees: [employeeRecord],
      };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },

  getAllRecords: async (date, q, { page, limit }) => {
    try {
      const skips = (page - 1) * limit;
      const searchQuery = {};
      if (q) {
        searchQuery["$or"] = [
          { "userDetails.firstName": { $regex: q, $options: "i" } },
          { "userDetails.lastName": { $regex: q, $options: "i" } },
          { "userDetails.officialEmail": { $regex: q, $options: "i" } },
          { "employees.timesheet": { $regex: q, $options: "i" } },
        ];
      }
      const attendanceRecords = await Attendance.aggregate([
        {
          $match: { attendanceDate: new Date(date) },
        },
        {
          $unwind: "$employees",
        },
        {
          $lookup: {
            from: "users",
            localField: "employees.user_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        { $match: searchQuery },
        {
          $addFields: {
            "employees.userName": {
              $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            attendanceDate: { $first: "$attendanceDate" },
            employees: { $push: "$employees" },
            isHoliday: { $first: "$isHoliday" },
          },
        },
        { $skip: skips },
        { $limit: limit },
      ]);

      const employeeCount = await TABLE_NAMES.ATTENDANCE.aggregate([
        {
          $match: { attendanceDate: new Date(date) },
        },
        {
          $unwind: "$employees",
        },
        {
          $count: "totalEmployees",
        },
      ]);

      const totalRecords =
        employeeCount.length > 0 ? employeeCount[0].totalEmployees : 0;

      return {
        records: attendanceRecords.length > 0 ? attendanceRecords[0] : null,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },

  getMyAttendanceDetails: async (date, user_id) => {
    try {
      let attendance = await getRecordByKey(TABLE_NAMES.ATTENDANCE, {
        attendanceDate: date,
      });

      if (!attendance) {
        return null;
      }

      // Find the attendance details for the logged-in user
      const employeeRecord = attendance.employees.find(
        (employee) => employee.user_id.toString() === user_id
      );

      if (!employeeRecord) {
        return null;
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
