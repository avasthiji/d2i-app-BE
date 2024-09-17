const { LeaveService } = require("../services/LeaveService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  //fetch all records for the current user
  index: async (req, res, next) => {
    try {
      const currentUserId = req.auth.userId;
      const { is_admin } = req.auth;
      let data;

      if (is_admin) {
        data = await LeaveService.getAllLeavesForAdmin();
      } else {
        data = await LeaveService.getLeavesByUserId(currentUserId);
      }

      res.status(200).json(ApiResponse("success", data));
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Show:  For managers/admin to view leaves submitted by their subordinates
  show: async (req, res, next) => {
    try {
      const managerId = req.auth.userId;
      const leaves = await LeaveService.getLeavesByManagerId(managerId);

      res.status(200).json(ApiResponse("success", leaves));
    } catch (error) {
      console.error(error);
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
          message:
            "All fields are required: leaveStart, leaveEnd, leaveType, dayType, reason",
        });
      }

      if (![0.5, 1].includes(leaveData.dayType)) {
        return res.status(400).json({
          message: "dayType must be either 0.5 (half day) or 1 (full day)",
        });
      }

      const newLeave = await LeaveService.createLeave(leaveData);
      res.status(201).json(ApiResponse("success", newLeave));
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Update: Handle leave approval and rejection
  update: async (req, res, next) => {
    try {
      const leaveId = req.params.leave_id;
      const { status } = req.body;
      const managerId = req.auth.userId;

      let updatedLeave;

      if (status === "approved") {
        updatedLeave = await LeaveService.approveLeave(leaveId, managerId);
      } else if (status === "rejected") {
        updatedLeave = await LeaveService.rejectLeave(leaveId, managerId);
      } else {
        return res.status(400).json({ message: "Invalid status provided" });
      }
      res.status(200).json(ApiResponse("success", updatedLeave));
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
