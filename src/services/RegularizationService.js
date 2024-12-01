const mongoose = require("mongoose");
const { ValidationError, NotFoundError } = require("../exceptions");
const Regularization = require("../models/Regularization");
const transporter = require("../utils/Mailer");
const CONSTANTS = require("../constants");
const {
  getRecordsByKey,
  getRecordByKey,
  insertRecord,
  updateRecordsByKey,
  deleteRecordsById,
} = require("../utils/QueryBuilder");
const { TABLE_NAMES } = require("../utils/db");

module.exports.RegularizationService = {
  // Get regularization requests by userId (for regular users)
  getRegularizationsByUserId: async (
    userId,
    { page = 1, limit = 10, receivedReqs = false }
  ) => {
    // Pagination and sorting by date
    const skips = (page - 1) * limit;
    const key = receivedReqs
      ? { submitted_to: userId }
      : { submitted_by: userId };

    const regularizations = await getRecordsByKey(
      TABLE_NAMES.REGULARIZATION,
      key,
      { limit, skip: skips }
    );

    const totalRecords = await Regularization.countDocuments(key);

    return {
      regularizations,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
    };
  },

  // Get regularizations for manager or admin
  getRegularizationsByManagerIdorAdmin: async ({
    managerId,
    is_admin,
    page = 1,
    limit = 10,
    status,
    month,
    year,
  }) => {
    const match = {};
    if (!is_admin) {
      match.managerId = new mongoose.Types.ObjectId(managerId);
    }

    if (status) {
      if (!["approved", "rejected", "pending"].includes(status)) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_ACTION);
      }
      match.status = status;
    }

    if (month) {
      const currentYear = new Date().getFullYear();
      const yearParam = year || currentYear;
      const startDate = new Date(`${yearParam}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      match.date = { $gte: startDate, $lt: endDate };
    }

    const skips = (page - 1) * limit;
    const regularizations = await Regularization.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userName: {
            $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"],
          },
        },
      },
    ])
      .sort({ date: -1 })
      .skip(skips)
      .limit(parseInt(limit));

    const totalRecords = await Regularization.countDocuments(match);
    return {
      regularizations,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
    };
  },

  getReqByID: async (requestId) => {
    try {
      const request = await getRecordByKey(TABLE_NAMES.REGULARIZATION, {
        _id: requestId,
      });

      if (!request) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.RECORD_NOT_FOUND);
      }
      return request;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },

  // Create a new regularization request
  createRegularization: async (data) => {
    try {
      const { submitted_by, date, reason } = data;

      const currentDate = new Date().toISOString().split("T")[0];
      const regularizationDate = new Date(date).toISOString().split("T")[0];

      if (regularizationDate > currentDate) {
        throw new ValidationError(CONSTANTS.ERROR_MESSAGES.INVALID_DATE);
      }

      // const overlappingRequest = await getRecordByKey(
      //   TABLE_NAMES.REGULARIZATION,
      //   {
      //     submitted_by,
      //     date,
      //     status: { $in: ["pending", "approved"] },
      //   }
      // );

      // if (overlappingRequest) {
      //   throw new ValidationError(CONSTANTS.ERROR_MESSAGES.ALREADY_REQUESTED);
      // }

      const user = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: submitted_by,
      });

      if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);

      // const manager = await getRecordByKey(TABLE_NAMES.USERS, {
      //   _id: user.parent_id,
      // });
      // if (!manager) throw new Error(CONSTANTS.ERROR_MESSAGES.MANAGER_NOT_FOUND);

      const newRequest = await insertRecord(TABLE_NAMES.REGULARIZATION, {
        submitted_by,
        submitted_to: user.parent_id.toString(),
        date,
        reason,
        status: "pending",
      });

      // const requestLink = `${CONSTANTS.URL.REGULARIZATION_URL}/${newRequest._id}`;
      // const mailOptions = {
      //   from: `"D2i Technology" <${user.officialEmail}>`,
      //   to: manager.officialEmail,
      //   subject: "New Regularization Request",
      //   html: `<p>Hello ${manager.firstName},</p>
      //   <p>${user.firstName} has requested regularization for ${date}.</p>
      //   <p>Reason: ${reason}</p>
      //   <p>Kindly review and approve/reject the request using the link below:</p>
      //   <a href="${requestLink}">Click here</a>`,
      // };
      // await transporter.sendMail(mailOptions);

      return newRequest;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },

  updateReq: async (requestId, updateData) => {
    try {
      let updatedData = await updateRecordsByKey(
        TABLE_NAMES.REGULARIZATION,
        { _id: requestId },
        updateData
      );
      return updatedData;
    } catch (error) {
      throw new Error("Error updating regularization request:" + error.message);
    }
  },

  deleteReq: async (requestId) => {
    try {
      return await deleteRecordsById(TABLE_NAMES.REGULARIZATION, {
        _id: requestId,
      });
    } catch (error) {
      throw new Error("Error deleting regularization request:" + error.message);
    }
  },
};
