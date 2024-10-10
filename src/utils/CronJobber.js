const { CronJob } = require("cron");

const moment = require("moment");
const { getRecordsByKey } = require("./QueryBuilder");

const { sendNotification } = require("../config/onesignal");
const User = require("../models/User");
const { TABLE_NAMES } = require("./db");

module.exports.HelperFunction = {
  checkDuplicateHolidayDates: (holidays, newHolidayDate) => {
    const holidayExists = holidays.some(
      (holiday) => moment(holiday.date).format("YYYY-MM-DD") === newHolidayDate
    );
    return holidayExists;
  },
};
async function getTodayEvents() {
  const today = moment().format("MM-DD");

  const usersWithBirthday = await getRecordsByKey(TABLE_NAMES.USERS, {
    $expr: {
      $eq: [{ $substr: ["$birthday", 5, 5] }, today],
    },
  });
  const usersWithWorkAnniversaries = await getRecordsByKey(TABLE_NAMES.USERS, {
    $expr: {
      $eq: [{ $substr: ["$joiningDate", 5, 5] }, today],
    },
  });

  const usersWithMarriageAnniversaries = await getRecordsByKey(
    TABLE_NAMES.USERS,
    {
      $expr: {
        $eq: [{ $substr: ["$anniversaryDate", 5, 5] }, today],
      },
    }
  );

  return {
    birthdays: usersWithBirthday,
    workAnniversaries: usersWithWorkAnniversaries,
    marriageAnniversaries: usersWithMarriageAnniversaries,
  };
}

async function sendDailyNotifications() {
  const events = await getTodayEvents();

  let messageParts = [];

  if (events.birthdays.length > 0) {
    const birthdayNames = events.birthdays
      .map((user) => user.firstName + " " + user.lastName)
      .join(", ");
    messageParts.push(`🎉 It's ${birthdayNames}'s birthday today!`);
  }

  if (events.workAnniversaries.length > 0) {
    const workAnniversaryNames = events.workAnniversaries
      .map((user) => user.firstName + " " + user.lastName)
      .join(", ");
    messageParts.push(
      `💼 It's ${workAnniversaryNames}'s work anniversary today!`
    );
  }

  if (events.marriageAnniversaries.length > 0) {
    const marriageAnniversaryNames = events.marriageAnniversaries
      .map((user) => user.firstName + " " + user.lastName)
      .join(", ");
    messageParts.push(
      `💍 It's ${marriageAnniversaryNames}'s marriage anniversary today!`
    );
  }

  if (messageParts.length > 0) {
    const fullMessage = messageParts.join("\n");
    await sendNotification("Daily Event Alert", fullMessage, "All");
  }
}

const job = new CronJob("0 9 * * *", async () => {
  await sendDailyNotifications();
});

job.start();

async function getTodayHoliday() {
  const today = moment().format("YYYY-MM-DD");

  const records = await getRecordsByKey(TABLE_NAMES.HOLIDAY, {
    "holidays.date": today,
  });

  // Extract holidays that match today
  let todayHolidays = [];
  records.forEach((record) => {
    const matchingHolidays = record.holidays.filter(
      (holiday) => moment(holiday.date).format("YYYY-MM-DD") === today
    );
    todayHolidays = todayHolidays.concat(matchingHolidays);
  });

  return todayHolidays;
}

async function CheckHolidayNotifications() {
  const holidays = await getTodayHoliday();
  if (holidays.length > 0) {
    const holidayNames = holidays.map((holiday) => holiday.name).join(",");
    const message = `🎉 Holiday today: ${holidayNames}`;

    await sendNotification("Holiday Alert", message, "All");
  }
}

const HolidayJob = new CronJob("0 8 * * *", async () => {
  await CheckHolidayNotifications();
});
HolidayJob.start();
