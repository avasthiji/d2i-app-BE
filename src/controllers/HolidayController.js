const { HolidayService } = require("../services/HolidayService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      const { name, date } = req.body;

      if (!is_admin) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!name && !date) {
        return res
          .status(400)
          .json({ message: "Name and Date are required fields" });
      }

      const record = await HolidayService.createHoliday(name, date);

      res.status(201).json(record);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, q } = req.query;
      const record = await HolidayService.getHolidays(q, {
        page: parseInt(page),
        limit: parseInt(limit),
      });
      res.status(200).json(ApiResponse("success", record));
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;

      if (is_admin) {
        const { holiday_id } = req.params;
        const holiday = await HolidayService.getHolidayById(holiday_id);

        if (holiday) {
          res.status(200).json(ApiResponse("success", holiday));
        } else {
          res.status(404).json({ message: "Holiday not found" });
        }
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;

      const { holiday_id: id } = req.params;
      const { name, date } = req.body;

      if (is_admin) {
        const record = await HolidayService.updateHoliday(id, {
          name,
          date,
        });

        res.status(200).json(ApiResponse("success", record));
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
