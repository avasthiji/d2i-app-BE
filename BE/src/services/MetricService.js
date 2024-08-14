const Metric = require('../models/Metric');
const { ApiResponse } = require('../utils/ApiHelper');
const { getRecordByKey, updateRecordsByKey, deleteRecordsById, getRecordsByKey } = require('../utils/QueryBuilder');

module.exports.MetricService ={

    createMetric: async(metricData)=>{
        try{
            const metric = new Metric(metricData);
            await metric.save();

            if(!metric){
                throw new Error("Error creating metric:");
            }
            return ApiResponse("success",metric);
        }catch(error){
            throw new Error("Error creating metric:" + error.message);
        }
    },
    getAllMetrics: async()=>{
        try{
            const metrics = await getRecordsByKey(Metric,{});
            return ApiResponse("success",metrics);
        }catch(error){
            throw new Error("Error fetching metrics:"+ error.message);
        }
    },
    getMetricsById: async (metricId)=>{
        try{
            const metric = await getRecordByKey(Metric, {_id: metricId});

            if(!metric) throw new Error("Metric not found");
            
            return ApiResponse("success",metric);
        }catch(error){
            throw new Error("Error in fetching metric:"+ error.message);
        }
    },
    updateMetric: async(metricId,metricData)=>{
        try{
            return await updateRecordsByKey(Metric, {_id:metricId}, metricData);
        }catch(error){
            throw new Error("Error updating metric:" + error.message);
        }
    },
    deleteMetric: async(metricId)=>{
        try{
            return await deleteRecordsById(Metric, {_id:metricId}); 
        }catch(error){
            throw new Error("Error deleting metric:"+ error.message);
        }
    }

}