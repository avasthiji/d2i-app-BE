const { DuplicateEntry } = require("../exceptions");
const User = require("../models/User");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const { insertRecord } = require("../utils/QueryBuilder");

const AuthService = require("./AuthService");

module.exports.SignupService = {
  registerUser: async (userData) => {
    try {
      const user = await insertRecord(TABLE_NAMES.USERS, userData);
      await user.save()
      
      if(!user){
        throw new Error("Error registering user:");
      }
      // Generate a token
      const authToken = AuthService.createToken(user.id);

      return ApiResponse("success",{
        token: authToken,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        officialEmail: user.officialEmail,
        alternateEmail: user.alternateEmail,
        contactNumber: user.contactNumber,
        alternateContactNumber: user.alternateContactNumber,
        birthday: user.birthday,
        bloodGroup: user.bloodGroup,
      });
    } catch (error) {
      throw new DuplicateEntry({"message":error.message});
    }
  },
};
