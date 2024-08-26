const Metric = require("../models/Metric");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const { getRecordByKey, insertRecord } = require("../utils/QueryBuilder");

module.exports.RewardService = {
    assignReward: async(user_id, metric_id, points, comment, submittedBy)=>{
      try{
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
      }catch(error){
      throw new Error("Error assigning points: " + error.message);
    }
}
};