const mongoose = require("mongoose");
const resourceModel = require("../models/rc_resource.model");
// const User = require('../models/user.model');
// var Schema = mongoose.Schema;
var Types = mongoose.Schema.Types;

const rc_tagSchema = mongoose.Schema({
        tagtitle: String,
        priority: Number,
        role: String,
        trashstatus: Number,
        resourcecount: Number,
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