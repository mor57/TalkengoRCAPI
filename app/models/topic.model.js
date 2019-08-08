const mongoose = require("mongoose");

const topicSchema = mongoose.Schema(
  {
    name: String,
    groupname: String
  },
  {
    timestamps: true
  }
);

var topic = (module.exports = mongoose.model("topic", topicSchema));
