const { HolidayService } = require("../services/HolidayService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      const { year, holidays } = req.body;

      if (!is_admin) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!year || !holidays || !holidays.length) {
        return res
          .status(400)
          .json({ message: "Year and Holidays are required fields" });
      }

      // Check if holidays for this year already exist
      const existingHolidays = await HolidayService.getHolidaysByYear(year);
      
      if (existingHolidays) {
        return res
          .status(400)
          .json({
            message: `Holidays for the year ${year} already exist. Please use update method.`,
          });
      }

      const record = await HolidayService.createHoliday(year, holidays);

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
//currently might be not needing it then will be removed
  // show: async (req, res, next) => {
  //   try {
  //     const { is_admin } = req.auth;

  //     if (is_admin) {
  //       const { holiday_id } = req.params;
  //       const holiday = await HolidayService.getHolidayById(holiday_id);

  //       if (holiday) {
  //         res.status(200).json(ApiResponse("success", holiday));
  //       } else {
  //         res.status(404).json({ message: "Holiday not found" });
  //       }
  //     } else {
  //       res.status(403).json({ message: "Access denied" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // },

  update: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;

      const { holiday_id:year } = req.params;
      
      const { holidays } = req.body;

      if (is_admin) {
        if (!holidays || !holidays.length) {
          return res
            .status(400)
            .json({ message: "Holidays array is required" });
        }

        // Check if holidays for this year exist
        const existingHolidays = await HolidayService.getHolidaysByYear(year);
        if (!existingHolidays) {
          return res
            .status(404)
            .json({ message: `No holidays found for the year ${year}` });
        }

        const updatedRecord = await HolidayService.updateHoliday(year, holidays);

        res.status(200).json(ApiResponse("success", updatedRecord));
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
