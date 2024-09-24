const moment = require("moment");
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

      let newEmployeeIdNumber = 1;
      if (latestUser) {
        const latestEmployeeId = parseInt(
          latestUser.employeeId.replace("D2I_", "")
        );
        newEmployeeIdNumber = latestEmployeeId + 1;
      }
      const newEmployeeId = `D2I_${newEmployeeIdNumber}`;

      const newAdmin = await insertRecord(TABLE_NAMES.USERS, {
        ...userData,
        employeeId: newEmployeeId,
        userState: "active",
        role: "ADMIN",
        joiningDate: moment(new Date()).format("YYYY-MM-DD"),
      });
      return newAdmin;
    } catch (error) {
      throw error;
    }
  },
};
