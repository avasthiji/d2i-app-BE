const CONSTANTS = require("../constants");
const { BadRequestError } = require("../exceptions");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const { HelperFunction } = require("../utils/HelperFunction");
const {
  insertRecord,
  getRecordsByKey,
  updateRecordsByKey,
} = require("../utils/QueryBuilder");
const moment = require("moment/moment");

module.exports.HolidayService = {
  createHoliday: async (year, holidays, force = false) => {
    try {
      const existingHolidaysRecord = await await getRecordsByKey(
        TABLE_NAMES.HOLIDAY,
        {
          year,
        }
      );

      // Check for duplicates within the same request
      const formattedHolidays = holidays.map((holiday) => ({
        ...holiday,
        formattedDate: moment(holiday.date).format("YYYY-MM-DD"),
      }));

      // Check for internal duplicates in the new holidays
      const dateSet = new Set();
      for (const holiday of formattedHolidays) {
        if (dateSet.has(holiday.formattedDate)) {
          throw new Error(`Duplicate holiday found: ${holiday.formattedDate}`);
        }
        dateSet.add(holiday.formattedDate);
      }

      if (existingHolidaysRecord && existingHolidaysRecord.length > 0) {
        if (!force) {
          throw new Error(`Holidays for the year ${year} already exist.`);
        } else {
          const updatedHolidayRecord = await updateRecordsByKey(
            TABLE_NAMES.HOLIDAY,
            { year },
            { holidays: formattedHolidays }
          );

          if (!updatedHolidayRecord) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_UPDATING_ERROR);
          }
          return ApiResponse("success", updatedHolidayRecord);
        }
      } else {
      }
      const holidayRecord = await insertRecord(TABLE_NAMES.HOLIDAY, {
        year: year,
        holidays: holidays,
      });
      if (!holidayRecord) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_CREATING_ERROR);
      }
      return ApiResponse("success", holidayRecord);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  getHolidays: async (queryYear, { page, limit }) => {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {};

      if (queryYear) {
        const year = Number(queryYear);
        if (!isNaN(year)) {
          searchQuery["$or"] = [{ year: year }];
        }
      }
      const records = await getRecordsByKey(TABLE_NAMES.HOLIDAY, searchQuery, {
        limit,
        skip,
        sortField: "date",
        sortOrder: "asc",
      });
      if (!records || records.length === 0) {
        return {
          Holidays: records,
          totalRecords: 0,
          totalPages: 0,
          currentPage: page,
        };
      } else {
        const Holidays = records[0].holidays;

        const totalRecords = records[0].holidays.length;

        return {
          Holidays,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
        };
      }
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
  updateHolidayById: async (holiday_id, updatedData) => {
    try {
      const holidayRecord = await getRecordsByKey(TABLE_NAMES.HOLIDAY, {
        "holidays._id": holiday_id,
      });

      if (!holidayRecord || holidayRecord.length === 0) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_NOT_FOUND);
      }

      const yearHolidays = holidayRecord[0];

      //index of the holiday to update
      const holidayIndex = yearHolidays.holidays.findIndex(
        (holiday) => holiday._id.toString() === holiday_id
      );

      if (holidayIndex === -1) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_NOT_FOUND);
      }

      // Check for duplicate holiday dates
      const formattedDate = moment(updatedData.date).format("YYYY-MM-DD");
      const otherHolidays = yearHolidays.holidays.filter(
        (holiday) => holiday._id.toString() !== holiday_id
      );

      if (
        HelperFunction.checkDuplicateHolidayDates(otherHolidays, formattedDate)
      ) {
        throw new Error(`Leave already exists on: ${formattedDate}`);
      }

      // Prepare the update query
      const updateQuery = {
        $set: {
          [`holidays.${holidayIndex}.name`]: updatedData.name,
          [`holidays.${holidayIndex}.date`]: updatedData.date,
          [`holidays.${holidayIndex}.is_optional`]: updatedData.is_optional,
        },
      };

      // Update the holiday
      const updatedRecord = await updateRecordsByKey(
        TABLE_NAMES.HOLIDAY,
        { _id: yearHolidays._id },
        updateQuery
      );

      if (!updatedRecord) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.HOLIDAY_UPDATING_ERROR);
      } else {
        return updatedRecord;
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
};
