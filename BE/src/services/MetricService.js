const Metric = require('../models/Metric');
const { ApiResponse } = require('../utils/ApiHelper');
const { TABLE_NAMES } = require('../utils/db');
const { getRecordByKey, updateRecordsByKey, deleteRecordsById, getRecordsByKey, insertRecord } = require('../utils/QueryBuilder');

module.exports.MetricService = {
  createMetric: async (metricData) => {
    try {
      // const metric = new Metric(metricData);
      const metric = await insertRecord(TABLE_NAMES.METRICS, metricData);

      if (!metric) {
        throw new Error("Error creating metric:");
      }
      return ApiResponse("success", metric);
    } catch (error) {
      throw new Error("Error creating metric:" + error.message);
    }
  },
  getAllMetrics: async () => {
    try {
      const metrics = await getRecordsByKey(TABLE_NAMES.METRICS, {});
      return ApiResponse("success", metrics);
    } catch (error) {
      throw new Error("Error fetching metrics:" + error.message);
    }
  },
  getMetricsById: async (metricId) => {
    try {
      const metric = await getRecordByKey(TABLE_NAMES.METRICS, {
        _id: metricId,
      });

      if (!metric) throw new Error("Metric not found");

      return ApiResponse("success", metric);
    } catch (error) {
      throw new Error("Error in fetching metric:" + error.message);
    }
  },
  updateMetric: async (metricId, metricData) => {
    try {
      return await updateRecordsByKey(
        TABLE_NAMES.METRICS,
        { _id: metricId },
        metricData
      );
    } catch (error) {
      throw new Error("Error updating metric:" + error.message);
    }
  },
  deleteMetric: async (metricId) => {
    try {
      return await deleteRecordsById(TABLE_NAMES.METRICS, {
        _id: metricId,
      });
    } catch (error) {
      throw new Error("Error deleting metric:" + error.message);
    }
  },
  // Fetch all parent metrics (i.e., metrics with parent_id == null)
  getParentMetrics: async () => {
    try {
      const parentMetrics = await getRecordsByKey(TABLE_NAMES.METRICS, {
        parent_id: null,
      });

      if (!parentMetrics || parentMetrics.length === 0) {
        throw new Error("No parent metrics found");
      }

      return ApiResponse("success", parentMetrics);
    } catch (error) {
      throw new Error("Error fetching parent metrics: " + error.message);
    }
  },
  // Fetch child metrics for a given parentId
  // getChildMetricsByParentId: async (parentId) => {

  //   try {
  //     const childMetrics = await getRecordsByKey(Metric, {
  //       parent_id: parentId,
  //     });

  //     if (!childMetrics || childMetrics.length === 0) {
  //       throw new Error("No child metrics found for the given parent ID");
  //     }

  //     return ApiResponse("success", childMetrics);
  //   } catch (error) {
  //     throw new Error("Error fetching child metrics: " + error.message);
  //   }
  // },
  getChildMetricsByParentId: async (metricId) => {
    
    try {
     const parentMetric = await getRecordByKey(TABLE_NAMES.METRICS, {_id:metricId});

     if(!parentMetric){
      throw new Error("metric not found");
     }
     const childMetrics = await getRecordsByKey(TABLE_NAMES.METRICS, {parent_id:metricId});
     const result = {
      ...parentMetric._doc,
      sub_metrics:childMetrics
     };

      return ApiResponse("success", result);
    } catch (error) {
      throw new Error("Error fetching child metrics: " + error.message);
    }
  },
};