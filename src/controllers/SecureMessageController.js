const { SecretMessageService } = require("../services/SecretMessageService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        message,
        user_id: recipient_id,
        secretKey,
        securemessage_id,
      } = req.body;
      const { userId: sender_id } = req.auth;

      let secretMessage;
      if (message) {
        secretMessage = await SecretMessageService.sendSecureMessage({
          message,
          recipient_id,
          sender_id,
          secretKey,
        });
      } else {
        secretMessage = await SecretMessageService.readSecureMessage({
          securemessage_id,
          secretKey,
          sender_id,
        });
      }

      res.status(201).json(ApiResponse("success", secretMessage));
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { userId } = req.auth;

      const records = await SecretMessageService.getMyMessages(userId);

      res.status(200).json(ApiResponse("success", records));
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { securemessage_id } = req.params;

      const { userId } = req.auth;

      const deletedMessage = await SecretMessageService.deleteMessage(
        securemessage_id,
        userId
      );

      res.status(200).json(ApiResponse("success", deletedMessage));
    } catch (error) {
      next(error);
    }
  },
};
