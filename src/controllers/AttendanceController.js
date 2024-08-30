const { AttendanceService } = require("../services/AttendanceService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  //punchIn
  create: async (req, res, next) => {
    try {
      let { attendanceDate } = req.body;
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
      const attendance = await AttendanceService.punchIn(date, user_id);
      res.json(ApiResponse("success", attendance));
    } catch (error) {
      next(error);
    }
  },
  //punchOut
  update: async (req, res, next) => {
    try {
      let { attendanceDate } = req.body;
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
      const attendance = await AttendanceService.punchOut(date, user_id);
      res.json(ApiResponse("success", attendance));
    } catch (error) {
      next(error);
    }
  },

  // show: async (req, res, next) => {
  //   try {
  //     const { attendanceDate: date } = req.query;
  //     const user_id = req.auth.userId;

  //     const attendanceDetails = await AttendanceService.getMyAttendanceDetails(
  //       date,
  //       user_id
  //     );
  //     res.json(ApiResponse("success", attendanceDetails));
  //   } catch (error) {
  //     next(error);
  //   }
  // },

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
