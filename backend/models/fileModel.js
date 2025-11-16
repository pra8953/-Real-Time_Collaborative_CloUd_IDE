const mongoose = require("mongoose");
const fileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    default: "plaintext",
  },
  content: {
    type: String,
    default: "",
  },
  version: {
    type: Number,
    default: 1,
  },
  projectId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
  required: true,
},

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const fileModel = mongoose.model("File", fileSchema);
module.exports = fileModel;
