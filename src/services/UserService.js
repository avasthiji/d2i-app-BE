const { NotFoundError } = require("../exceptions");
const moment = require("moment");
const crypto = require("crypto");
const User = require("../models/User");
const { TABLE_NAMES } = require("../utils/db");
const {
  getRecordsByKey,
  getRecordByKey,
  insertRecord,
  updateRecordsByKey,
  deleteRecordsById,
  getLatestRecordByKey,
} = require("../utils/QueryBuilder");

module.exports.UserService = {
  getAllUsers: async (currentUserId, includeSelf) => {
    try {
      const users = await getRecordsByKey(TABLE_NAMES.USERS, {
        userState: "active",
      });
      if (!includeSelf) {
        const filteredUsers = users.filter(
          (user) => user._id.toString() !== currentUserId.toString()
        );
        return filteredUsers;
      } else {
        return users;
      }
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserByID: async (userId) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId });

      if (!user) {
        throw new Error("User not Found");
      }
      return user;
    } catch (error) {
      // throw new NotFoundError({message:error.message});
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

      let newEmployeeId = 1;
      if (latestUser && latestUser?.employeeId) {
        newEmployeeId = latestUser.employeeId + 1;
      }

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
  searchUsers: async (query, currentUserId) => {
    try {
      const searchQuery = {
        $and: [
          { _id: { $ne: currentUserId } }, // Exclude current user
          {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { officialEmail: { $regex: query, $options: "i" } },
            ],
          },
        ],
        userState: "active", // for non-deleted user only
      };

      const users = await getRecordsByKey(TABLE_NAMES.USERS, searchQuery);

      if (!users.length) {
        return null;
      }
      return users;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};
