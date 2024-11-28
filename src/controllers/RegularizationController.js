const CONSTANTS = require("../constants");
const { RegularizationService } = require("../services/RegularizationService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  // Fetch all regularization requests for the current user
  index: async (req, res, next) => {
    try {
      const currentUserId = req.auth.userId;
      const { page = 1, limit = 10, receivedReqs = "false" } = req.query;

      const data = await RegularizationService.getRegularizationsByUserId(
        currentUserId,
        { page, limit, receivedReqs: receivedReqs === "true" }
      );

      res.status(200).json(ApiResponse("success", data));
    } catch (error) {
      next(error);
    }
  },

  // Show: For managers/admin to view regularization requests submitted by their subordinates
  show: async (req, res, next) => {
    try {
      const { userId: managerId, is_admin } = req.auth;
      const { page = 1, limit = 10, status, month, year } = req.query;

      const requests =
        await RegularizationService.getRegularizationsByManagerIdOrAdmin({
          managerId,
          is_admin,
          page,
          limit,
          status,
          month,
          year,
        });

      res.status(200).json(ApiResponse("success", requests));
    } catch (error) {
      next(error);
    }
  },

  // Create: Submit a new regularization request
  create: async (req, res, next) => {
    try {
      const regularizationData = req.body;
      regularizationData.submitted_by = req.auth.userId;
      if (!regularizationData.date || !regularizationData.reason) {
        return res.status(400).json({
          message: CONSTANTS.ERROR_MESSAGES.REGULARIZATION_FIELDS_REQUIRED,
        });
      }
      const newRequest = await RegularizationService.createRegularization(
        regularizationData
      );
      res.status(201).json(ApiResponse("success", newRequest));
    } catch (error) {
      next(error);
    }
  },

  // Update: Handle regularization approval or rejection
  update: async (req, res, next) => {
    try {
      const requestId = req.params.request_id;
      const { status } = req.body;
      const managerId = req.auth.userId;
      const { is_admin } = req.auth;

      let updatedRequest;

      if (status === "approved") {
        updatedRequest = await RegularizationService.approveRegularization(
          requestId,
          managerId,
          is_admin
        );
      } else if (status === "rejected") {
        updatedRequest = await RegularizationService.rejectRegularization(
          requestId,
          managerId,
          is_admin
        );
      } else {
        return res
          .status(400)
          .json({ message: CONSTANTS.ERROR_MESSAGES.INVALID_ACTION });
      }

      res.status(200).json(ApiResponse("success", updatedRequest));
    } catch (error) {
      next(error);
    }
  },
};
