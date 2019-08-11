const mongoose = require("mongoose");
// const User = require('../models/user.model');
// var Schema = mongoose.Schema;
// var Types = mongoose.Schema.Types;

const rc_catSchema = mongoose.Schema(
  {
    cattitle: String,
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

// module.exports = mongoose.model("rc_cat", rc_catSchema);
var rc_cat = (module.exports = mongoose.model("rc_cat", rc_catSchema));
