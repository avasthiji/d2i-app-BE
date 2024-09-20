const { AttendanceService } = require("../services/AttendanceService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  //punchIn and punchout
  create: async (req, res, next) => {
    try {
      let { attendanceDate, action, timesheet } = req.body;
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
        attendance = await AttendanceService.punchOut(date, user_id, timesheet);
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

      let { attendanceDate: date } = req.query;
      if (date) {
        date = new Date(
          Date.UTC(
            new Date(date).getFullYear(),
            new Date(date).getMonth(),
            new Date(date).getDate()
          )
        );
      } else {
        date = new Date(
          Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
        );
      }

      const attendanceDetails = await AttendanceService.getMyAttendanceDetails(
        date,
        loggedInuserId
      );

      res.json(ApiResponse("success", attendanceDetails || null));
    } catch (error) {
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      if (is_admin) {
        const { attendanceDate: date, page = 1, limit = 10 } = req.query;

        const attendanceRecord = await AttendanceService.getAllRecords(date, {
          page: parseInt(page),
          limit: parseInt(limit),
        });
        res.json(ApiResponse("success", attendanceRecord || null));
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      next(error);
    }
  },
};
