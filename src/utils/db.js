const User = require('../models/User')
const Metric = require('../models/Metric')
const Reward = require('../models/Reward');
const TABLE_NAMES = {
  USERS: User,
  METRICS: Metric,
  REWARDS:Reward
};
module.exports = {
  TABLE_NAMES,
};
