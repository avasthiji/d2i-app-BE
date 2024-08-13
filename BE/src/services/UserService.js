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
      console.log("get all users req");
      const users = await getRecordsByKey(User, {});
      // const users = await User.find();
      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserByID: async (userId) => {
    try {
      const user = await getRecordByKey(User, { _id: userId });
      // const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error("Error fetching user by Id");
    }
  },
  createUser: async (userData) => {
    try {
      // console.log("creating user service");
      return await insertRecord(User, userData);
    } catch (error) {
      throw new Error("Error creating user:" + error.message);
    }
  },
  updateUser: async (userId, updateData) => {
    try {
      return await updateRecordsByKey(User, { _id: userId }, updateData);
    } catch (error) {
      throw new Error("Error updating user:" + error.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      return await deleteRecordsById(User, { _id: userId });
    } catch (error) {
      throw new Error("Error deleting user" + error.message);
    }
  },
};
