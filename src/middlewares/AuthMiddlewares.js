const AuthService = require("../services/AuthService.js");
const { UnauthorizedError } = require("../exceptions");

module.exports = {
  verify: (allowedRoles = []) => {
    return async (req, res, next) => {
      try {
        const authorization = (req.headers["authorization"] || "").split(" ");
        const token = authorization.length > 1 ? authorization[1] : "";
        const user = await AuthService.verifyToken(token);

        if (!user) {
          return next(new UnauthorizedError());
        }

        // Attach user info to request
        req.auth = {
          ...user,
          is_admin: user.userRole === "ADMIN",
          is_user: user.userRole === "USER",
        };

        //check if the user's role is allowed
        if (allowedRoles.length === 0 || allowedRoles.includes(user.userRole)) {
          next();
        } else {
          next(new UnauthorizedError());
        }
      } catch (error) {
        next(new UnauthorizedError());
      }
    };
  },
};
