const User = require("../models/User");
const { TABLE_NAMES } = require("../utils/db");
const {
  getRecordsByKey,
  getRecordByKey,
  insertRecord,
  updateRecordsByKey,
  deleteRecordsById,
} = require("../utils/QueryBuilder");

module.exports.UserService = {
  getAllUsers: async () => {
    try {
      const users = await getRecordsByKey(TABLE_NAMES.USERS, {});

      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserByID: async (userId) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId });

      return user;
    } catch (error) {
      throw new Error("Error fetching user by Id");
    }
  },
  // createUser: async (userData) => {
  //   try {
  //     // console.log("creating user service");
  //     return await insertRecord(User, userData);
  //   } catch (error) {
  //     throw new Error("Error creating user:" + error.message);
  //   }
  // },
  updateUser: async (userId, updateData) => {
    try {
      return await updateRecordsByKey(
        TABLE_NAMES.USERS,
        { _id: userId },
        updateData
      );
    } catch (error) {
      throw new Error("Error updating user:" + error.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      return await deleteRecordsById(TABLE_NAMES.USERS, { _id: userId });
    } catch (error) {
      throw new Error("Error deleting user" + error.message);
    }
  },
};
