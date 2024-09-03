const { AttendanceService } = require("../services/AttendanceService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  //punchIn and punchout
  create: async (req, res, next) => {
    try {
      let { attendanceDate, action } = req.body;
      if (!action) {
        return res
          .status(400)
          .json({ message: "Action is required(punchIn or punchOut)" });
      }
      if (attendanceDate) {
        attendanceDate = new Date(attendanceDate);
      }

      const date = attendanceDate
        ? new Date(
            Date.UTC(
              attendanceDate.getFullYear(),
              attendanceDate.getMonth(),
              attendanceDate.getDate()
            )
          )
        : new Date(
            Date.UTC(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            )
          );

      const user_id = req.auth.userId;
      let attendance;
      if (action === "punchIn") {
        attendance = await AttendanceService.punchIn(date, user_id);
      } else if (action === "punchOut") {
        attendance = await AttendanceService.punchOut(date, user_id);
      } else {
        return res.status(400).json({ message: "Invalid Action specified." });
      }
      res.json(ApiResponse("success", attendance));
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const userId = req.params.attendance_id;

      const loggedInuserId = req.auth.userId;

      if (userId !== loggedInuserId) {
        return res
          .status(403)
          .json(
            ApiResponse("error", "You are not authorized to access this data.")
          );
      }
      // const { attendanceDate: date } = req.body;
      //  if (date) {
      //    date = new Date(date);
      //  }
      const date = new Date(
        Date.UTC(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      );

      const attendanceDetails = await AttendanceService.getMyAttendanceDetails(
        date,
        loggedInuserId
      );
      res.json(ApiResponse("success", attendanceDetails));
    } catch (error) {
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      if (is_admin) {
        const { attendanceDate: date } = req.body;
        const attendanceRecord = await AttendanceService.getAllRecords(date);
        res.json(ApiResponse("success", attendanceRecord));
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      next(error);
    }
  },
};