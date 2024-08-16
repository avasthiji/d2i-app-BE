const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    metric_id:{
        type: mongoose.Schema.Types.ObjectId, ref:'Metric', required:true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId, ref:'User', required:true
    },
    points:{
        type:Number, required:true
    },
    comment:{
        type:String, default:null
    },
    submitted_by:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    created_at:{type:Date, default:Date.now}
});

const Reward = mongoose.model("Reward", rewardSchema);
module.exports = Reward;