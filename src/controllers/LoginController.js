const { LoginService } = require("../services/LoginService");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { officialEmail, password } = req.body;
      const data = await LoginService.loginUser(officialEmail, password);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
