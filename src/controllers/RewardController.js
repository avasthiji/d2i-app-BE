const { RewardService } = require("../services/RewardService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { user_id, metric_id, points, comment } = req.body;

      const submitted_by = req.auth.userId;

      const response = await RewardService.assignReward(
        user_id,
        metric_id,
        points,
        comment,
        submitted_by
      );
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.auth.userId;
      const data = await RewardService.getRewardsById(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.status(200).json(ApiResponse("success", data));
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
