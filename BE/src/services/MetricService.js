const Metric = require('../models/Metric');
const { ApiResponse } = require('../utils/ApiHelper');
const { TABLE_NAMES } = require('../utils/db');
const { getRecordByKey, updateRecordsByKey, deleteRecordsById, getRecordsByKey, insertRecord } = require('../utils/QueryBuilder');

module.exports.MetricService ={

    createMetric: async(metricData)=>{
        try{
            // const metric = new Metric(metricData);
            const metric = await insertRecord(TABLE_NAMES.METRICS, metricData);

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
            const metrics = await getRecordsByKey(TABLE_NAMES.METRICS, {});
            return ApiResponse("success",metrics);
        }catch(error){
            throw new Error("Error fetching metrics:"+ error.message);
        }
    },
    getMetricsById: async (metricId)=>{
        try{
            const metric = await getRecordByKey(TABLE_NAMES.METRICS, {
              _id: metricId,
            });

            if(!metric) throw new Error("Metric not found");
            
            return ApiResponse("success",metric);
        }catch(error){
            throw new Error("Error in fetching metric:"+ error.message);
        }
    },
    updateMetric: async(metricId,metricData)=>{
        try{
            return await updateRecordsByKey(
              TABLE_NAMES.METRICS,
              { _id: metricId },
              metricData
            );
        }catch(error){
            throw new Error("Error updating metric:" + error.message);
        }
    },
    deleteMetric: async(metricId)=>{
        try{
            return await deleteRecordsById(TABLE_NAMES.METRICS, {
              _id: metricId,
            }); 
        }catch(error){
            throw new Error("Error deleting metric:"+ error.message);
        }
    }

}