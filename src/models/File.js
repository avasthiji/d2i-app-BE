const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  name: { type: String, default: null },
  is_active: { type: Boolean, default: true },
});

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true, default: null },
  fileNames: [docSchema],
});

const File = mongoose.model("file", fileSchema);

module.exports = File;
