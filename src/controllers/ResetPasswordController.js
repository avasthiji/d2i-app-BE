const CONSTANTS = require("../constants");
const { ResetPasswordService } = require("../services/ResetPasswordService");

module.exports = {
  create: async (req, res, next) => {
    try {
      const inviteCode = req.query.inviteCode;
      const { password } = req.body;
      if (!inviteCode) {
        return res
          .status(400)
          .json({ message: CONSTANTS.ERROR_MESSAGES.REQUIRED_INVITE });
      }
      const data = await ResetPasswordService.registerUser({
        inviteCode,
        password,
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
