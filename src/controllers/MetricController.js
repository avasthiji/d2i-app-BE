const { MetricService } = require("../services/MetricService");

module.exports = {

  index: async (req, res, next) => {
    try {
      const data = await MetricService.getParentMetrics();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const parentId = req.params.metrics_id;
      const data = await MetricService.getChildMetricsByParentId(parentId);

      if (!data) {
        return res
          .status(404)
          .json({ message: "No child metrics found for this parent" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //create
  create: async (req, res, next) => {
    try {
      const metricData = req.body;
      const newMetric = await MetricService.createMetric(metricData);
      res.status(201).json(newMetric);
    } catch (error) {
      console.log(error);
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
        return res.status(404).json({ message: "Metric not found" });
      }
      res.status(200).json(updatedMetric);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //delete
  delete: async (req, res, next) => {
    try {
      const metricId = req.params.metrics_id;
      const deletedMetric = await MetricService.deleteMetric(metricId);

      if (!deletedMetric) {
        return res.status(404).json({ message: "Metric not found" });
      }
      res.status(200).json({ message: "Metric deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
