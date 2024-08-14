const User = require('../models/User')
const Metric = require('../models/Metric')
const TABLE_NAMES = {
  USERS: User,
  METRICS: Metric,
};
module.exports = {
  TABLE_NAMES,
};
