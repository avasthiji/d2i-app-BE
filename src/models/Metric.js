const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  maximum_points: { type: Number, required: true },
  is_active: { type: Boolean, required: true },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Metric",
    default: null,
  },
});

const Metric = mongoose.model("Metric", metricSchema);
module.exports = Metric;
