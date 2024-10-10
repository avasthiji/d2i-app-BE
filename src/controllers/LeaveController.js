const CONSTANTS = require("../constants");
const { LeaveService } = require("../services/LeaveService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  //fetch all records for the current user
  index: async (req, res, next) => {
    try {
      const currentUserId = req.auth.userId;
      const { page = 1, limit = 10, month, year } = req.query;

      const data = await LeaveService.getLeavesByUserId(currentUserId, {
        page,
        limit,
        month,
        year,
      });

      res.status(200).json(ApiResponse("success", data));
    } catch (error) {
      next(error);
    }
  },

  // Show:  For managers/admin to view leaves submitted by their subordinates
  show: async (req, res, next) => {
    try {
      const { userId: managerId, is_admin } = req.auth;
      const { page = 1, limit = 10, status, month, year } = req.query;

      const leaves = await LeaveService.getLeavesByManagerIdorAdmin({
        managerId,
        is_admin,
        page,
        limit,
        status,
        month,
        year,
      });

      res.status(200).json(ApiResponse("success", leaves));
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const leaveData = req.body;
      leaveData.userId = req.auth.userId;

      if (
        !leaveData.leaveStart ||
        !leaveData.leaveEnd ||
        !leaveData.leaveType ||
        !leaveData.dayType ||
        !leaveData.reason
      ) {
        return res.status(400).json({
          message: CONSTANTS.ERROR_MESSAGES.LEAVE_FIELDS_REQUIRED,
        });
      }

      if (![0.5, 1].includes(leaveData.dayType)) {
        return res.status(400).json({
          message: CONSTANTS.ERROR_MESSAGES.LEAVE_DAY_TYPE_ERROR,
        });
      }

      const newLeave = await LeaveService.createLeave(leaveData);
      res.status(201).json(ApiResponse("success", newLeave));
    } catch (error) {
      next(error);
    }
  },

  // Update: Handle leave approval and rejection
  update: async (req, res, next) => {
    try {
      const leaveId = req.params.leave_id;
      const { status } = req.body;
      const managerId = req.auth.userId;
      const { is_admin } = req.auth;

      let updatedLeave;

      if (status === "approved") {
        updatedLeave = await LeaveService.approveLeave(
          leaveId,
          managerId,
          is_admin
        );
      } else if (status === "rejected") {
        updatedLeave = await LeaveService.rejectLeave(
          leaveId,
          managerId,
          is_admin
        );
      } else {
        return res
          .status(400)
          .json({ message: CONSTANTS.ERROR_MESSAGES.INVALID_ACTION });
      }
      res.status(200).json(ApiResponse("success", updatedLeave));
    } catch (error) {
      next(error);
    }
  },
};
