const Metric = require("../models/Metric");

exports.createCoreSkill = async (req, res) => {
  try {
    const { label, maximum_points, is_active } = req.body;
    const coreSkill = new Metric({
      label,
      maximum_points,
      is_active,
      parent_id: null,
    });
    await coreSkill.save();
    res.status(201).json(coreSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createSubSkill = async (req, res) => {
  try {
    const { label, maximum_points, is_active, parent_id } = req.body;

    //checking if the parent skill exists
    const parentSkill = await Metric.findById(parent_id);
    if (!parentSkill) {
      return res.status(404).json({ message: "Parent skill not found" });
    }
    const subSkill = new Metric({
      label,
      maximum_points,
      is_active,
      parent_id: parent_id,
    });

    await subSkill.save();
    res.status(201).json(subSkill);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllMetrics = async (req, res) => {
  try {
    console.log("get all metric route");
    const metrics = await Metric.find();
    // console.log(metrics);

    res.status(200).json(metrics);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updateMetric = async (req, res) => {
  try {
    let { id } = req.params;
    // console.log("update route");
    // console.log(id);

    const metric = await Metric.findByIdAndUpdate(id, req.body, { new: true });
    if (!metric) {
      return res.status(404).json({ message: "Metric not found" });
    } else {
      res.status(200).json(metric);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteMetric = async (req, res) => {
  try {
    let { id } = req.params;
    // console.log("delete route");
    // console.log(id);
    const metric = await Metric.findByIdAndDelete(id);
    if (!metric) {
      return res.status(404).json({ message: "Metric Not Found" });
    } else {
      res.status(200).json({ message: "Metric deleted" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// parentmetrics
exports.getParentMetrics = async (req, res) => {
  try {
    console.log("Fetching parent metrics");
    const parentMetrics = await Metric.find({ parent_id: null });
    res.status(200).json(parentMetrics);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//  function to fetch child metrics
exports.getChildMetrics = async (req, res) => {
  try {
    const { parentId } = req.params;
    const childMetrics = await Metric.find({ parent_id: parentId });
    res.status(200).json(childMetrics);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
