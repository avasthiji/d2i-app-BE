const { RewardService } = require("../services/RewardService");

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
      const userId = req.auth.userId;
      const data = await RewardService.getRewardsById(userId);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
