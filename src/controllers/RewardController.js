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
};
