const mongoose = require("mongoose");
const { ValidationError } = require("../exceptions");
const Leave = require("../models/Leave");
const transporter = require("../utils/Mailer");
const CONSTANTS = require("../constants");
const {
  getRecordsByKey,
  getRecordByKey,
  insertRecord,
  updateRecordsByKey,
} = require("../utils/QueryBuilder");
const { TABLE_NAMES } = require("../utils/db");

module.exports.LeaveService = {
  // Get leaves by userId (for regular users)
  getLeavesByUserId: async (userId, { page = 1, limit = 10, month, year }) => {
    const query = { userId };

    //filter by  month
    if (month) {
      const currentYear = new Date().getFullYear();
      const yearParam = year || currentYear;
      const startDate = new Date(`${yearParam}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      query.leaveStart = { $gte: startDate, $lt: endDate };
    }

    //pagination and sorting by leaveStart
    const skips = (page - 1) * limit;
    const leaves = await getRecordsByKey(TABLE_NAMES.LEAVE, query, {
      limit,
      skip: skips,
      sortField: "leaveStart",
      sortOrder: "desc",
    });

    const totalRecords = await Leave.countDocuments(query);
    return {
      leaves,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
    };
  },

  // Get leaves by managerId (for 2nd level managers or admin)
  getLeavesByManagerIdorAdmin: async ({
    managerId,
    is_admin,
    page = 1,
    limit = 10,
    status,
    month,
    year,
  }) => {
    try {
      const match = {};
      if (!is_admin) {
        match.managerId = new mongoose.Types.ObjectId(managerId);
      }

      if (status) {
        if (
          status !== "approved" &&
          status !== "rejected" &&
          status !== "pending"
        ) {
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
        match.leaveStart = { $gte: startDate, $lt: endDate };
      }

      const skips = (page - 1) * limit;
      const leaves = await Leave.aggregate([
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
        {
          $project: {
            _id: 1,
            userId: 1,
            managerid: 1,
            userName: 1,
            leaveStart: 1,
            leaveEnd: 1,
            leaveType: 1,
            dayType: 1,
            reason: 1,
            status: 1,
          },
        },
      ])
        .sort({ leaveStart: -1 })
        .skip(skips)
        .limit(parseInt(limit));

      const totalRecords = await Leave.countDocuments(match);
      return {
        leaves,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: parseInt(page),
      };
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },

  createLeave: async (leaveData) => {
    try {
      const { userId, leaveStart, leaveEnd, leaveType, dayType, reason } =
        leaveData;

      const startDate = new Date(leaveStart).toISOString().split("T")[0];
      const endDate = new Date(leaveEnd).toISOString().split("T")[0];
      const currentDate = new Date().toISOString().split("T")[0];

      if (startDate < currentDate) {
        throw new ValidationError(CONSTANTS.ERROR_MESSAGES.LEAVE_START_DATE);
      }

      if (endDate < startDate) {
        throw new ValidationError(CONSTANTS.ERROR_MESSAGES.LEAVE_END_DATE);
      }

      const overlappingLeave = await getRecordByKey(TABLE_NAMES.LEAVE, {
        userId,
        $or: [
          { leaveStart: { $lte: leaveEnd }, leaveEnd: { $gte: leaveStart } },
        ],
        status: { $in: ["pending", "approved"] },
      });

      if (overlappingLeave) {
        throw new ValidationError(
          CONSTANTS.ERROR_MESSAGES.ALREADY_LEAVE_REQUEST
        );
      }

      const user = await getRecordByKey(TABLE_NAMES.USERS, { _id: userId });
      if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);

      const manager = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: user.parent_id,
      });
      if (!manager) throw new Error(CONSTANTS.ERROR_MESSAGES.MANAGER_NOT_FOUND);

      const newLeave = await insertRecord(TABLE_NAMES.LEAVE, {
        userId,
        managerId: user.parent_id,
        leaveStart,
        leaveEnd,
        leaveType,
        dayType,
        reason,
        status: "pending",
      });

      const applyLeaveLink = `${CONSTANTS.URL.LEAVE_URL}`;
      const mailOptions = {
        from: user.officialEmail,
        to: manager.officialEmail,
        subject: "New Leave Application",
        html: `<p>Hello ${manager.firstName},</p>
      <p>${user.firstName} has applied for ${
          dayType === 1 ? "full day" : "half day"
        } ${leaveType} leave from ${leaveStart} to ${leaveEnd}.</p>
        <p>Reason: ${reason}</p>
        <p>Kindly click the link below to review and approve/reject the leave:</p>
        <a href="${applyLeaveLink}">Click here</a>`,
      };
      await transporter.sendMail(mailOptions);

      return newLeave;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },

  approveLeave: async (leaveId, managerId, is_admin) => {
    try {
      const leave = await getRecordByKey(TABLE_NAMES.LEAVE, { _id: leaveId });
      if (!leave) throw new Error(CONSTANTS.ERROR_MESSAGES.LEAVE_NOT_FOUND);

      if (!is_admin && leave.managerId.toString() !== managerId) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.NOT_AUTHORIZED);
      }

      if (leave.status !== "pending") {
        throw new Error(CONSTANTS.ERROR_MESSAGES.LEAVE_ALREADY_PROCESSED);
      }

      const updatedLeave = await updateRecordsByKey(
        TABLE_NAMES.LEAVE,
        { _id: leaveId },
        { status: "approved" }
      );

      const user = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: leave.userId,
      });
      const manager = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: managerId,
      });
      const approveLeaveLink = `${CONSTANTS.URL.LEAVE_URL}/${user._id}`;
      const mailOptions = {
        from: manager.officialEmail,
        to: user.officialEmail,
        subject: "Leave Approved",
        html: `<p>Hello ${user.firstName},</p>
      <p>Your leave has been approved, Click on the below link to Check.</p>
      <a href="${approveLeaveLink}">Click Here</a>`,
      };
      await transporter.sendMail(mailOptions);

      return updatedLeave;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },

  rejectLeave: async (leaveId, managerId, is_admin) => {
    try {
      const leave = await getRecordByKey(TABLE_NAMES.LEAVE, { _id: leaveId });
      if (!leave) throw new Error(CONSTANTS.ERROR_MESSAGES.LEAVE_NOT_FOUND);

      if (!is_admin && leave.managerId.toString() !== managerId) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.NOT_AUTHORIZED);
      }

      if (leave.status !== "pending") {
        throw new Error(CONSTANTS.ERROR_MESSAGES.LEAVE_ALREADY_PROCESSED);
      }

      const updatedLeave = await updateRecordsByKey(
        TABLE_NAMES.LEAVE,
        { _id: leaveId },
        { status: "rejected" }
      );

      const user = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: leave.userId,
      });
      const manager = await getRecordByKey(TABLE_NAMES.USERS, {
        _id: managerId,
      });

      const leaveLink = `${CONSTANTS.URL.LEAVE_URL}/${user._id}`;
      const mailOptions = {
        from: manager.officialEmail,
        to: user.officialEmail,
        subject: "Leave Rejected",
        html: `<p>Hello ${user.firstName},</p>
             <p>Your leave has been rejected, Click on the below link to Check.</p>
      <a href="${leaveLink}">Click Here</a>`,
      };
      await transporter.sendMail(mailOptions);

      return updatedLeave;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },
};
