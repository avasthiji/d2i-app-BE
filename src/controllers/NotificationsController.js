const { sendNotification } = require("../config/onesignal");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { heading, content, segment } = req.body;
      const notificationId = await sendNotification(heading, content, segment);
      res.json({ success: true, notificationId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
      next(error);
    }
  },
};
