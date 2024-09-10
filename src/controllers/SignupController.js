const { SignupService } = require("../services/SignupService");

module.exports = {
  create: async (req, res, next) => {
    try {
      const inviteCode = req.query.inviteCode;
      const { password } = req.body;
      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code is required" });
      }
      const data = await SignupService.registerUser({ inviteCode, password });
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
