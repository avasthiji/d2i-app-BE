const User = require("../models/User");
const Metric = require("../models/Metric");
const Reward = require("../models/Reward");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const TABLE_NAMES = {
  USERS: User,
  METRICS: Metric,
  REWARDS: Reward,
  ATTENDANCE: Attendance,
  LEAVE: Leave,
};
module.exports = {
  TABLE_NAMES,
};
