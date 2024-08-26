const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    try {
      const { query } = req.query;

      const searchCriteria = {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { officialEmail: { $regex: query, $options: "i" } },
        ],
      };
      const users = await User.find(searchCriteria);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
};
