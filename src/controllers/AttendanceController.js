const { AttendanceService } = require("../services/AttendanceService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { attendanceDate: date, user_id } = req.body;
      const attendance = await AttendanceService.punchIn(date, user_id);
      res.json(ApiResponse("success", attendance));
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { attendanceDate: date, user_id } = req.body;
      const attendance = await AttendanceService.punchOut(date, user_id);
      res.json(ApiResponse("success", attendance));
    } catch (error) {
      next(error);
    }
  },
};
