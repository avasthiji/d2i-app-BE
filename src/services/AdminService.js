const { TABLE_NAMES } = require("../utils/db");
const crypto = require("crypto");
const { getLatestRecordByKey, insertRecord } = require("../utils/QueryBuilder");
const { Password } = require("@mui/icons-material");

module.exports.AdminService = {
  createAdmin: async (userData) => {
    try {
      const latestUser = await getLatestRecordByKey(
        TABLE_NAMES.USERS,
        {},
        "createdAt",
        "desc"
      );

      let newEmployeeId = 1;
      if (latestUser) {
        newEmployeeId = latestUser.employeeId + 1;
      }
      const inviteCode = crypto.randomBytes(16).toString("hex");
      const newAdmin = await insertRecord(TABLE_NAMES.USERS, {
        ...userData,
        employeeId: newEmployeeId,
        userState: "active",
        role: "ADMIN",
      });
      return newAdmin;
    } catch (error) {
      throw error;
    }
  },
};
