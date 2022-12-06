const mongoose = require("../db/index");

const Schema = mongoose.Schema;

const UploadSchema = new Schema({
  name: String,
  hash: String,
  ext: String,
  creatTime: Date,
});

const Upload = mongoose.model("Upload", UploadSchema);

module.exports = Upload;
