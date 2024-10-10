const moment = require("moment/moment");

module.exports.HelperFunction = {
  checkDuplicateHolidayDates: (holidays, newHolidayDate) => {
    const holidayExists = holidays.some(
      (holiday) => moment(holiday.date).format("YYYY-MM-DD") === newHolidayDate
    );
    return holidayExists;
  },
};
