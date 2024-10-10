const { NotFoundError } = require("../exceptions");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const {
  getRecordByKey,
  updateRecordsByKey,
  deleteRecordsById,
  getRecordsByKey,
  insertRecord,
} = require("../utils/QueryBuilder");
const CONSTANTS = require("../constants");

module.exports.MetricService = {
  createMetric: async (metricData) => {
    try {
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

      if (!metric) throw new Error(CONSTANTS.ERROR_MESSAGES.METRIC_NOT_FOUND);

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
  getParentMetrics: async (q, { page, limit }) => {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {
        parent_id: null,
      };
      if (q) {
        searchQuery["$or"] = [{ label: { $regex: q, $options: "i" } }];
      }
      const parentMetrics = await getRecordsByKey(
        TABLE_NAMES.METRICS,
        searchQuery,
        searchQuery,
        { limit, skip }
      );

      const totalRecords = await TABLE_NAMES.METRICS.countDocuments(
        searchQuery
      );

      return {
        metrics: parentMetrics,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error("Error fetching parent metrics: " + error.message);
    }
  },
  getChildMetricsByParentId: async (metricId, q, { page, limit }) => {
    try {
      const parentMetric = await getRecordByKey(TABLE_NAMES.METRICS, {
        _id: metricId,
      });

      if (!parentMetric) {
        return {
          parentMetric: null,
          sub_metrics: [],
          totalRecords: 0,
          totalPages: 0,
          currentPage: 1,
        };
      }
      const searchQuery = {
        parent_id: metricId,
      };
      if (searchQuery) {
        searchQuery["$or"] = [{ label: { $regex: q, $options: "i" } }];
      }
      const skip = (page - 1) * limit;
      const childMetrics = await getRecordsByKey(
        TABLE_NAMES.METRICS,
        searchQuery,
        { limit, skip }
      );

      const totalRecords = await TABLE_NAMES.METRICS.countDocuments(
        searchQuery
      );

      return {
        parentMetric: parentMetric._doc,
        sub_metrics: childMetrics,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
};
