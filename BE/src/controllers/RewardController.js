const { RewardService } = require("../services/RewardService");

module.exports = {
    create: async(req,res,next)=>{
        try{
            const {userId, metricId, points, comment} = req.body;
            console.log(req);
            console.log(req.user);
            
            const submitted_by = req.user._id;

            const response = await RewardService.assignReward(userId,metricId,points,comment,submitted_by);
            res.status(201).json(response);
        }catch(error){
          console.log(error); // Log the error
          next(error); // Pass the error to the error handling middleware
        }
    }
}