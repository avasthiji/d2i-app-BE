const { SubordinateService } = require("../services/SubordinateService");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
      const data = await SubordinateService.getAllSubordinates(); //service method to get all users
      res.status(200).json(data);
    } catch (error) {
      console.log(error); //needs a handleError utils
      next(error);
    }
  }
};