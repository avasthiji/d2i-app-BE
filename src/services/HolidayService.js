const CONSTANTS = require("../constants");
const { BadRequestError } = require("../exceptions");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const {
  insertRecord,
  getRecordsByKey,
  updateRecordsByKey,
} = require("../utils/QueryBuilder");

module.exports.HolidayService = {
  createHoliday: async (year, holidays) => {
    try {
      const holidayRecord = await insertRecord(TABLE_NAMES.HOLIDAY, {
        year: year,
        holidays: holidays,
      });
      if (!holidayRecord) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_CREATING_ERROR);
      }
      return ApiResponse("success", holidayRecord);
    } catch (error) {
      throw new Error("Error creating holiday:" + error.message);
    }
  },
  getHolidays: async (q, { page, limit }) => {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {};

      if (q) {
        const year = Number(q);
        if (!isNaN(year)) {
          searchQuery["$or"] = [
            { year: year },
            { "holidays.name": { $regex: q, $options: "i" } },
          ];
        } else {
          searchQuery["holidays.name"] = { $regex: q, $options: "i" };
        }
      }
      const records = await getRecordsByKey(TABLE_NAMES.HOLIDAY, searchQuery, {
        limit,
        skip,
        sortField: "date",
        sortOrder: "asc",
      });

      const totalRecords = await TABLE_NAMES.HOLIDAY.countDocuments(
        searchQuery
      );

      return {
        records,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error("Error Fetching holidays:" + error.message);
    }
  },
  getHolidayById: async (holiday_id) => {
    try {
      const holidayRecord = await getRecordsByKey(TABLE_NAMES.HOLIDAY, {
        "holidays._id": holiday_id,
      });
      if (!holidayRecord || holidayRecord.length === 0) {
        return null;
      }
      const holiday = holidayRecord[0].holidays.find(
        (holiday) => holiday._id.toString() === holiday_id
      );

      if (!holiday) {
        return null;
      }

      return holiday;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  // Get holidays by year (new method to check if holidays exist for a specific year)
  getHolidaysByYear: async (year) => {
    try {
      const holidayRecord = await getRecordsByKey(TABLE_NAMES.HOLIDAY, {
        year,
      });
      return holidayRecord.length > 0 ? holidayRecord[0] : null;
    } catch (error) {
      throw new Error("Error fetching holidays for year: " + error.message);
    }
  },
  updateHoliday: async (year, holidays) => {
    try {
      const updatedRecord = await updateRecordsByKey(
        TABLE_NAMES.HOLIDAY,
        { year },
        { holidays }
      );

      if (!updatedRecord) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.NO_HOLIDAYS_FOR_YEAR);
      }

      return {
        year: updatedRecord.year,
        holidays: updatedRecord.holidays,
      };
    } catch (error) {
      throw new Error("Error updating Holiday:" + error.message);
    }
  },
};
