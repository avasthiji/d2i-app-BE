const User = require("../models/User");
const bcrypt = require("bcrypt");
const AuthService = require("./AuthService");
const { ApiResponse } = require("../utils/ApiHelper");
const { AccessDeniedError, ValidationError } = require("../exceptions");
const { TABLE_NAMES } = require("../utils/db");
const { getRecordByKey } = require("../utils/QueryBuilder");

module.exports.LoginService = {
  loginUser: async (officialEmail, password) => {
    try {
      // Check if user exists
      const user = await getRecordByKey(TABLE_NAMES.USERS, { officialEmail });

      if (!user) throw new Error("User not found");
      //check if passowrd matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      // Generate a token
      const authToken = AuthService.createToken(user.id, user.role);

      return ApiResponse("success", {
        token: authToken,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        officialEmail: user.officialEmail,
        alternateEmail: user.alternateEmail,
        contactNumber: user.contactNumber,
        alternateContactNumber: user.alternateContactNumber,
        birthday: user.birthday,
        bloodGroup: user.bloodGroup,
        role: user.role,
      });
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },
};
