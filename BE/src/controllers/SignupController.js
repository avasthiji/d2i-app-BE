const { SignupService } = require("../services/SignupService");

module.exports = {
  create: async (req, res, next) => {
    try {
      const userData = req.body;
      const data = await SignupService.registerUser(userData);
      return res.status(200).json(data);
      // return data;
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
