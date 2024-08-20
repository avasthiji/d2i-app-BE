const AuthService = require("../services/AuthService.js");

module.exports = {
  verify: async (req, res, next) => {
    try {
      const authorization = (req.headers["authorization"] || "").split(" ");
      const user = await AuthService.verifyToken(
        authorization.length > 1 ? authorization[1] : ""
      );

      if (user) {
        req.auth = user;
        next();
      } else {
        throw new Error("some auth error");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
