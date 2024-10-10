const moment = require("moment/moment");
const CONSTANTS = require("../constants");
const { HolidayService } = require("../services/HolidayService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      const { year, holidays, force = false } = req.body;

      if (!is_admin) {
        return res
          .status(403)
          .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
      if (!year || !holidays || !holidays.length) {
        return res
          .status(400)
          .json({ message: CONSTANTS.ERROR_MESSAGES.HOLIDAY_REQUIRED_FIELDS });
      }

      const record = await HolidayService.createHoliday(year, holidays, force);

      res.status(201).json(record);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, year } = req.query;

      const queryYear = year || moment().year();

      const record = await HolidayService.getHolidays(queryYear, {
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
          res
            .status(404)
            .json({ message: CONSTANTS.ERROR_MESSAGES.HOLIDAY_NOT_FOUND });
        }
      } else {
        res
          .status(403)
          .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;

      const { holiday_id } = req.params;

      const { name, date, is_optional = false } = req.body;

      if (!name || !date) {
        res.status(400).json({ message: "Name and date are required fields" });
      } else {
        // Validate the date format
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
          return res.status(400).json({
            message: `Invalid date format for holiday: ${name}. Expected format: YYYY-MM-DD.`,
          });
        }

        if (is_admin) {
          const formattedDate = moment(date).format("YYYY-MM-DD");

          const updatedHolidayRecord = await HolidayService.updateHolidayById(
            holiday_id,
            { name, date: formattedDate, is_optional }
          );
          if (!updatedHolidayRecord) {
            return res
              .status(404)
              .json({ message: CONSTANTS.ERROR_MESSAGES.HOLIDAY_NOT_FOUND });
          }

          res.status(200).json(ApiResponse("success", updatedHolidayRecord));
        } else {
          return res
            .status(403)
            .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
