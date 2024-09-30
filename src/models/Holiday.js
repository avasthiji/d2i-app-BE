const mongoose = require("mongoose");

const holdiaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
});

const Holiday = new mongoose.model("Holiday", holdiaySchema);
module.exports = Holiday;
