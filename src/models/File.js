const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, default: null },
  fileNames: [{ type: String, default: null }],
});

const File = mongoose.model("file", fileSchema);

module.exports = File;
