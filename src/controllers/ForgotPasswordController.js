const { ForgotPasswordService } = require("../services/ForgotPasswordService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      let response;
      if (req.body.otp) {
        const { email, otp, password } = req.body;
        response = await ForgotPasswordService.resetPasswordWithOtp(
          email,
          otp,
          password
        );
      } else if (req.body.email) {
        const { email } = req.body;
        response = await ForgotPasswordService.requestOtp(email);
      } else {
        return { message: "INVALID BODY" };
      }
      return res.status(200).json(ApiResponse("success", response.message));
    } catch (error) {
      next(error);
    }
  },
};
