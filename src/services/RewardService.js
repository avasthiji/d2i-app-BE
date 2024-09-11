const mongoose = require("mongoose");
const { NotFoundError } = require("../exceptions");
const Metric = require("../models/Metric");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const {
  getRecordByKey,
  insertRecord,
  getRecordsByKey,
  runAggregation,
} = require("../utils/QueryBuilder");
const User = require("../models/User");
const Reward = require("../models/Reward");

module.exports.RewardService = {
  assignReward: async (user_id, metric_id, points, comment, submittedBy) => {
    try {
      // Validate that the points are within the allowed range
      const metric = await getRecordByKey(TABLE_NAMES.METRICS, {
        _id: metric_id,
      });
      if (!metric) {
        throw new Error("Metric not found");
      }

      if (points < -metric.maximum_points || points > metric.maximum_points) {
        throw new Error("Points out of allowed range");
      }

      //creating reward
      const newReward = await insertRecord(TABLE_NAMES.REWARDS, {
        user_id: user_id,
        metric_id: metric_id,
        points: points,
        comment: comment,
        submitted_by: submittedBy,
      });

      return ApiResponse("success", newReward);
    } catch (error) {
      throw new Error("Error assigning points: " + error.message);
    }
  },
  getRewardsById: async (userId) => {
    try {
      const rewards = await Reward.aggregate([
        {
          $match: { user_id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "submitted_by",
            foreignField: "_id",
            as: "submittedByInfo",
          },
        },
        {
          $unwind: {
            path: "$submittedByInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            submittedByName: {
              $concat: [
                "$submittedByInfo.firstName",
                " ",
                "$submittedByInfo.lastName",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "metrics",
            localField: "metric_id",
            foreignField: "_id",
            as: "metricInfo",
          },
        },
        {
          $unwind: {
            path: "$metricInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            metricName: "$metricInfo.label",
            metricParentId: "$metricInfo.parent_id",
          },
        },
        {
          $lookup: {
            from: "metrics",
            localField: "metricParentId",
            foreignField: "_id",
            as: "parentMetricInfo",
          },
        },
        {
          $unwind: {
            path: "$parentMetricInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            metricParentName: "$parentMetricInfo.label",
          },
        },
        {
          $project: {
            _id: 1,
            metric_id: 1,
            user_id: 1,
            points: 1,
            comment: 1,
            submitted_by: 1,
            created_at: 1,
            submittedByName: 1,
            metricName: 1,
            metricParentName: { $ifNull: ["$metricParentName", null] },
          },
        },
      ]);

      if (!rewards || rewards.length === 0) {
        return ApiResponse("success", []);
      }

      return ApiResponse("success", rewards);
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};
