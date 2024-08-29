const User = require('../models/User')
const Metric = require('../models/Metric')
const Reward = require('../models/Reward');
const Attendance = require('../models/Attendance');
const TABLE_NAMES = {
  USERS: User,
  METRICS: Metric,
  REWARDS: Reward,
  ATTENDANCE: Attendance,
};
module.exports = {
  TABLE_NAMES,
};
