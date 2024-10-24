const { NotFoundError } = require("../exceptions");
const moment = require("moment");
const crypto = require("crypto");
const { TABLE_NAMES } = require("../utils/db");
const {
  getRecordsByKey,
  getRecordByKey,
  insertRecord,
  updateRecordsByKey,
  deleteRecordsById,
  getLatestRecordByKey,
} = require("../utils/QueryBuilder");
const CONSTANTS = require("../constants");

module.exports.UserService = {
  getAllUsers: async (currentUserId, includeSelf, { page, limit }) => {
    try {
      const filter = { userState: "active" };

      if (!includeSelf) {
        filter._id = { $ne: currentUserId };
      }
      const skips = (page - 1) * limit;

      const users = await getRecordsByKey(TABLE_NAMES.USERS, filter, {
        limit,
        skip: skips,
        sortField: "firstName",
        sortOrder: "asc",
      });

      const totalRecords = await getRecordsByKey(TABLE_NAMES.USERS, filter);

      return {
        users: users,
        totalRecords: totalRecords.length,
        totalPages: Math.ceil(totalRecords.length / limit),
        curentPage: page,
      };
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserByID: async (userId) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId });

      if (!user) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
  createUser: async (userData) => {
    try {
      const latestUser = await getLatestRecordByKey(
        TABLE_NAMES.USERS,
        {},
        "createdAt",
        "desc"
      );

      let newEmployeeIdNumber = 1;
      if (latestUser && latestUser?.employeeId) {
        const latestEmployeeId = parseInt(
          latestUser.employeeId.replace("d2i_", "")
        );
        newEmployeeIdNumber = latestEmployeeId + 1;
      }
      const newEmployeeId = `d2i_${newEmployeeIdNumber}`;

      //generate inviteCode
      const inviteCode = crypto.randomBytes(16).toString("hex");

      const newUser = await insertRecord(TABLE_NAMES.USERS, {
        ...userData,
        employeeId: newEmployeeId,
        password: null,
        userState: "invited",
        joiningDate:
          userData.joiningDate || moment(new Date()).format("YYYY-MM-DD"),
        inviteCode: inviteCode,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId, updateData) => {
    try {
      let updatedData = await updateRecordsByKey(
        TABLE_NAMES.USERS,
        { _id: userId },
        updateData
      );
      return updatedData;
    } catch (error) {
      throw new Error("Error updating user:" + error.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await deleteRecordsById(TABLE_NAMES.USERS, {
        _id: userId,
      });
      return response;
    } catch (error) {
      throw new Error("Error deleting user" + error.message);
    }
  },
  softDeleteUser: async (userId) => {
    try {
      const response = await updateRecordsByKey(
        TABLE_NAMES.USERS,
        { _id: userId },
        { userState: "deleted" }
      );
      return response;
    } catch (error) {
      throw new Error("Error Soft Deleting user" + error.message);
    }
  },
  searchUsers: async (query, currentUserId, { page, limit }) => {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {
        $and: [
          { _id: { $ne: currentUserId } }, // Exclude current user
          {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { officialEmail: { $regex: query, $options: "i" } },
              { employeeId: { $regex: query, $options: "i" } },
              { alternateEmail: { $regex: query, $options: "i" } },
              { role: { $regex: query, $options: "i" } },
              { bloodGroup: { $regex: query, $options: "i" } },
              { birthday: { $regex: query, $options: "i" } },
              { contactNumber: { $regex: query, $options: "i" } },
              { alternateContactNumber: { $regex: query, $options: "i" } },
            ],
          },
        ],
        userState: "active", // for non-deleted user only
      };

      const users = await getRecordsByKey(TABLE_NAMES.USERS, searchQuery, {
        limit,
        skip,
      });

      const totalRecords = await TABLE_NAMES.USERS.countDocuments(searchQuery);

      return {
        users,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};
