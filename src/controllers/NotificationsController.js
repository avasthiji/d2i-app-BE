const { sendNotification } = require("../config/onesignal");
const { TABLE_NAMES } = require("../utils/db");
const { getRecordByKey } = require("../utils/QueryBuilder");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { userId } = req.auth;
      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId });
      const heading = `${user.firstName} ${user.lastName} just sent a notification`;
      const segment = "All";
      const { content } = req.body;

      const notificationId = await sendNotification(heading, content, segment);

      res.json({ success: true, notificationId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
      next(error);
    }
  },
};
