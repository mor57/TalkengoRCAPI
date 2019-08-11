const mongoose = require("mongoose");
// const User = require('../models/user.model');
// var Schema = mongoose.Schema;
// var Types = mongoose.Schema.Types;

const rc_formatSchema = mongoose.Schema(
  {
    formattitle: String,
    type: String,
    priority: Number,
    role: String,
    trashstatus: Number,
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

// module.exports = mongoose.model("rc_format", rc_formatSchema);
var rc_format = (module.exports = mongoose.model("rc_format", rc_formatSchema));
