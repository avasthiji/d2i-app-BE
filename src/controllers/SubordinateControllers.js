const { SubordinateService } = require("../services/SubordinateService");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const data = await SubordinateService.getAllSubordinates(userId);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
