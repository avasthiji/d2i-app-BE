const User = require("../models/User");
const bcrypt = require("bcrypt");
const AuthService = require("./AuthService");

module.exports.LoginService = {
  loginUser: async (officialEmail, password) => {
    try {
      // Check if user exists
      const user = await User.findOne({ officialEmail });
      if (!user) throw new Error("User not found");
      //check if passowrd matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      // Generate a token
      const authToken = AuthService.createToken(user.id);

      return {
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
      };
    } catch (error) {
      throw new Error("Error registering user:" + error.message);
    }
  },
};
