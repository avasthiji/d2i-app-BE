const User = require("../models/User");
const Metric = require("../models/Metric");
const Reward = require("../models/Reward");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Holiday = require("../models/Holiday");
const File = require("../models/File");
const TABLE_NAMES = {
  USERS: User,
  METRICS: Metric,
  REWARDS: Reward,
  ATTENDANCE: Attendance,
  LEAVE: Leave,
  HOLIDAY: Holiday,
  FILE: File,
};
module.exports = {
  TABLE_NAMES,
};
