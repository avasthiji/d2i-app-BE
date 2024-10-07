const mongoose = require("mongoose");
const { ValidationError } = require("../exceptions");
const User = require("../models/User");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports.SubordinateService = {
  getAllSubordinates: async (userId) => {
    try {
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      const users = await User.aggregate([
        {
          $match: { _id: objectIdUserId },
        },
        {
          $graphLookup: {
            from: "users",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent_id",
            as: "subordinates",
          },
        },
      ]);

      if (!users || users.length === 0) {
        return ApiResponse("success", []);
      }

      return ApiResponse("success", users[0].subordinates);
    } catch (error) {
      throw new ValidationError(error.message);
    }
  },
};
