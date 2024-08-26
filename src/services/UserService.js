const { NotFoundError } = require("../exceptions");
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
      const users = await getRecordsByKey(TABLE_NAMES.USERS, {isActive: true});

      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserByID: async (userId) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId});

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
      const response = await insertRecord(User, userData);
      return response;
    } catch (error) {
      throw new Error("Error creating user:" + error.message);
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
      const response = await deleteRecordsById(TABLE_NAMES.USERS, { _id: userId });
      return response;
    } catch (error) {
      throw new Error("Error deleting user" + error.message);
    }
  },
  softDeleteUser: async(userId)=>{
    try{
      const response = await updateRecordsByKey(TABLE_NAMES.USERS,{_id:userId},{isActive: false});
      return response;
    }catch(error){
      throw new Error("Error Soft Deleting user"+error.message);
    }
  }
};
