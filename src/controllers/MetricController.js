const CONSTANTS = require("../constants");
const { MetricService } = require("../services/MetricService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  index: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, q } = req.query;
      const data = await MetricService.getParentMetrics(q, {
        page: parseInt(page),
        limit: parseInt(limit),
      });
      res.status(200).json(ApiResponse("success", data));
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, q } = req.query;
      const parentId = req.params.metrics_id;
      const data = await MetricService.getChildMetricsByParentId(parentId, q, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

      if (!data) {
        res.status(200).json(ApiResponse("success", data));
      } else {
        res.status(200).json(ApiResponse("success", data));
      }
    } catch (error) {
      next(error);
    }
  },

  //create
  create: async (req, res, next) => {
    try {
      const metricData = req.body;
      const { is_admin } = req.auth;
      if (is_admin) {
        const newMetric = await MetricService.createMetric(metricData);
        res.status(201).json(newMetric);
      } else {
        res
          .status(403)
          .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
    } catch (error) {
      next(error);
    }
  },
  //update
  update: async (req, res, next) => {
    try {
      const metricId = req.params.metrics_id;
      const updateData = req.body;
      const updatedMetric = await MetricService.updateMetric(
        metricId,
        updateData
      );

      if (!updatedMetric) {
        return res
          .status(400)
          .json({ message: CONSTANTS.ERROR_MESSAGES.METRIC_NOT_FOUND });
      }
      res.status(200).json(ApiResponse("success", updatedMetric));
    } catch (error) {
      next(error);
    }
  },

  //delete
  delete: async (req, res, next) => {
    try {
      const metricId = req.params.metrics_id;
      const deletedMetric = await MetricService.deleteMetric(metricId);

      if (!deletedMetric) {
        return res
          .status(404)
          .json({ message: CONSTANTS.ERROR_MESSAGES.METRIC_NOT_FOUND });
      }
      res
        .status(200)
        .json({ message: CONSTANTS.ERROR_MESSAGES.METRIC_DELETED });
    } catch (error) {
      next(error);
    }
  },
};
