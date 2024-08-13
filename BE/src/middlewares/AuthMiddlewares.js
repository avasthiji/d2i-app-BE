const { ERROR_MESSAGES } = require("../constants.js");
const AuthService = require("../services/auth.service.js");
const { GlobalException } = require("../exceptions/index.js");

module.exports = {
  verify: async (req, res, next) => {
    const authorization = (req.headers["authorization"] || "").split(" ");
    const user = await AuthService.verifyToken(
      authorization.length > 0 ? authorization[0] : ""
    );
    if (user) {
      req.auth = user;
      next();
    } else {
      throw new GlobalException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  },
};
