const { NotFoundError, ValidationError } = require("../exceptions");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const { getRecordsByKey } = require("../utils/QueryBuilder");

module.exports.SubordinateService = {
  getAllSubordinates: async (userId) => {
    try {
      const users = await getRecordsByKey(TABLE_NAMES.USERS, {
        parent_id: userId,
      });
      if (!users || users.length === 0) {
        return ApiResponse("success", []);
      }
      return ApiResponse("success", users);
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },
};
