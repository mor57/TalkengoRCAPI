const mongoose = require("mongoose");
// const User = require('../models/user.model');
// var Schema = mongoose.Schema;
// var Types = mongoose.Schema.Types;

const rc_tagSchema = mongoose.Schema(
  {
    tagtitle: String,
    priority: Number,
    role: String
  },
  // {
  //   toJSON: {
  //     virtuals: true
  //   }
  // },
  {
    timestamps: true
  }
);

// module.exports = mongoose.model("rc_tag", rc_tagSchema);
var rc_tag = (module.exports = mongoose.model("rc_tag", rc_tagSchema));
