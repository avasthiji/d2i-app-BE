const { CronJob } = require("cron");
const transporter = require("../utils/Mailer");

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

    for (let i = 0; i < events.birthdays.length; i++) {
      const birthdayPerson = events.birthdays[i];

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: birthdayPerson.officialEmail,
        subject: "Happy Birthday Wish",
        cc: `${process.env.COMPANY_EMAIL}, ${process.env.EMAIL_FROM}`,
        html: `<p>Hey ${birthdayPerson.firstName} ${birthdayPerson.lastName},
        </p>
        <p>
        Wishing you a fantastic birthday filled with joy and celebration! May your year ahead be as incredible as you are.
        </p>
        <p>
        Best wishes,<br>
        D2i Technology
       </p>
       <p>
        Short, sweet, and heartfelt. Cheers to celebrating another year!🍰
      </p>`,
      };

      await transporter.sendMail(mailOptions);
    }

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

const job = new CronJob("0 6 * * *", async () => {
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

const HolidayJob = new CronJob("0 6 * * *", async () => {
  await CheckHolidayNotifications();
});
HolidayJob.start();
