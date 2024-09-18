const mongoose = require("mongoose");
const {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} = require("../exceptions");
const Leave = require("../models/Leave");
const User = require("../models/User");
const transporter = require("../utils/Mailer");
const CONSTANTS = require("../constants");

module.exports.LeaveService = {
  // Get leaves by userId (for regular users)
  getLeavesByUserId: async (userId) => {
    return await Leave.find({ userId }).sort({ leaveStart: -1 });
  },

  // Get leaves by managerId (for 2nd level managers or admin)
  getLeavesByManagerId: async (managerId) => {
    try {
      const leaves = await Leave.aggregate([
        { $match: { managerId: new mongoose.Types.ObjectId(managerId) } },
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
      ]).sort({ leaveStart: -1 });

      return leaves;
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },

  createLeave: async (leaveData) => {
    try {
      const { userId, leaveStart, leaveEnd, leaveType, dayType, reason } =
        leaveData;

      const overlappingLeave = await Leave.findOne({
        userId,
        $or: [
          { leaveStart: { $lte: leaveEnd }, leaveEnd: { $gte: leaveStart } },
        ],
        status: { $in: ["pending", "approved"] },
      });

      if (overlappingLeave) {
        throw new ValidationError(
          "You already have a leave request for these dates."
        );
      }

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const manager = await User.findById(user.parent_id);
      if (!manager) throw new Error("Manager not found");

      const newLeave = await Leave.create({
        userId,
        managerId: user.parent_id,
        leaveStart,
        leaveEnd,
        leaveType,
        dayType,
        reason,
        status: "pending",
      });

      const applyLeaveLink = `${CONSTANTS.LEAVE_URL}`;
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

  approveLeave: async (leaveId, managerId) => {
    try {
      const leave = await Leave.findOne({ _id: leaveId, managerId });
      if (!leave) throw new Error("Leave not found or unauthorized");

      if (leave.status !== "pending") {
        throw new Error("Leave has already been processed.");
      }

      leave.status = "approved";
      await leave.save();

      const user = await User.findById(leave.userId);
      const manager = await User.findById(managerId);
      const approveLeaveLink = `${CONSTANTS.LEAVE_URL}/${user._id}`;
      const mailOptions = {
        from: manager.officialEmail,
        to: user.officialEmail,
        subject: "Leave Approved",
        html: `<p>Hello ${user.firstName},</p>
      <p>Your leave has been approved, Click on the below link to Check.</p>
      <a href="${approveLeaveLink}">Click Here</a>`,
      };
      await transporter.sendMail(mailOptions);

      return leave;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },

  rejectLeave: async (leaveId, managerId) => {
    try {
      const leave = await Leave.findOne({ _id: leaveId, managerId });
      if (!leave) throw new Error("Leave not found or unauthorized");

      if (leave.status !== "pending") {
        throw new Error("Leave has already been processed.");
      }

      leave.status = "rejected";
      await leave.save();

      const user = await User.findById(leave.userId);
      const manager = await User.findById(managerId);

      const leaveLink = `${CONSTANTS.LEAVE_URL}/${user._id}`;
      const mailOptions = {
        from: manager.officialEmail,
        to: user.officialEmail,
        subject: "Leave Rejected",
        html: `<p>Hello ${user.firstName},</p>
             <p>Your leave has been rejected, Click on the below link to Check.</p>
      <a href="${leaveLink}">Click Here</a>`,
      };
      await transporter.sendMail(mailOptions);

      return leave;
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },
};
