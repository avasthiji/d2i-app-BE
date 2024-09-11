const { TABLE_NAMES } = require("../utils/db");
const { getLatestRecordByKey, insertRecord } = require("../utils/QueryBuilder");

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

      const newAdmin = await insertRecord(TABLE_NAMES.USERS, {
        ...userData,
        employeeId: newEmployeeId,
        userState: "active",
        role: "ADMIN",
        joiningDate: Date.now(),
      });
      return newAdmin;
    } catch (error) {
      throw error;
    }
  },
};
