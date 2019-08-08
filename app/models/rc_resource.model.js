const mongoose = require("mongoose");
const tag = require('../models/rc_tag.model');
const cat = require('../models/rc_cat.model');
const topic = require('../models/topic.model');
// var Schema = mongoose.Schema;
var Types = mongoose.Schema.Types;

const rc_resourceSchema = mongoose.Schema(
  {
    resourcetitle: String,
    type: String,
    typestr: String,
    tags: [{ type: Types.ObjectId, ref: tag }],
    cats: [{ type: Types.ObjectId, ref: cat }],
    topics: [{ type: Types.ObjectId, ref: topic }],
    levels: [{ type: String }],
    access: String,
    accesspermission: String,
    subject: String,
    description: String,
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

// module.exports = mongoose.model("rc_resource", rc_resourceSchema);
var rc_resource = (module.exports = mongoose.model("rc_resource", rc_resourceSchema));
