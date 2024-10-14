const moment = require("moment/moment");

module.exports.HelperFunction = {
  checkDuplicateHolidayDates: (holidays, newHolidayDate) => {
    const holidayExists = holidays.some(
      (holiday) => moment(holiday.date).format("YYYY-MM-DD") === newHolidayDate
    );
    return holidayExists;
  },
  generateOtp: () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return otp;
  },
};
