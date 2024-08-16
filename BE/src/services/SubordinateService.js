const { TABLE_NAMES } = require("../utils/db");
const { getRecordsByKey } = require("../utils/QueryBuilder");

module.exports.SubordinateService = {
  getAllSubordinates: async () => {
    try {
      const users = await getRecordsByKey(TABLE_NAMES.USERS, {});
      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
};
