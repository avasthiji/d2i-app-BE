const mongoose = require("mongoose");
const { BadRequestError } = require("../exceptions");
const { TABLE_NAMES } = require("../utils/db");
const { HelperFunction } = require("../utils/HelperFunction");
const {
  insertRecord,
  getRecordByKey,
  deleteRecordsById,
} = require("../utils/QueryBuilder");
const CONSTANTS = require("../constants");

module.exports.SecretMessageService = {
  sendSecureMessage: async ({
    message,
    recipient_id,
    sender_id,
    secretKey,
  }) => {
    try {
      const encryptedMessage = HelperFunction.encryptMessage(
        message,
        secretKey
      );

      const record = await insertRecord(TABLE_NAMES.SECUREMESSAGE, {
        message: encryptedMessage,
        user_id: recipient_id,
        sender_id,
      });

      return record;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  readSecureMessage: async ({ securemessage_id, secretKey, sender_id }) => {
    try {
      const messageRecord = await getRecordByKey(TABLE_NAMES.SECUREMESSAGE, {
        _id: securemessage_id,
      });

      if (messageRecord && messageRecord.user_id.toString() === sender_id) {
        const decryptedMessage = HelperFunction.decryptMessage(
          messageRecord.message,
          secretKey
        );

        return decryptedMessage;
      } else {
        throw new Error({ message: "Bad request" });
      }
    } catch (error) {
      throw new BadRequestError(error.reason);
    }
  },
  getMyMessages: async (userId) => {
    try {
      const messages = await mongoose.model("SecureMessage").aggregate([
        // Match records by user_id (recipient)
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },

        // Lookup to get sender information (sender_id -> users collection)
        {
          $lookup: {
            from: "users", // users collection
            localField: "sender_id", // field in SecureMessage
            foreignField: "_id", // field in users collection
            as: "sender_info",
          },
        },
        { $unwind: "$sender_info" }, // Unwind to flatten the sender_info array
        {
          $project: {
            _id: 1,
            message: 1,
            createdAt: 1,
            sender_name: {
              $concat: ["$sender_info.firstName", " ", "$sender_info.lastName"],
            },
          },
        },
      ]);

      return messages;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  deleteMessage: async (securemessage_id, userId) => {
    try {
      const messageRecord = await getRecordByKey(TABLE_NAMES.SECUREMESSAGE, {
        _id: securemessage_id,
      });
      if (messageRecord) {
        if (
          userId === messageRecord.user_id.toString() ||
          userId === messageRecord.sender_id.toString()
        ) {
          const deleteMessage = await deleteRecordsById(
            TABLE_NAMES.SECUREMESSAGE,
            { _id: securemessage_id }
          );

          return CONSTANTS.ERROR_MESSAGES.MESSAGE_DELETE_SUCCESS;
        } else {
          return CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED;
        }
      } else {
        return CONSTANTS.ERROR_MESSAGES.RECORD_NOT_FOUND;
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
};
