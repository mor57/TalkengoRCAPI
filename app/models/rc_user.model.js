const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
// const rc_tag = require("./rc_tag.model");
var Schema = mongoose.Schema;
// var Types = mongoose.Schema.Types;

// rc_user Schema
const rc_userSchema = Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      max: 200
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    role: {
      type: String
    }
    // ,
    // fn: {
    //   type: String,
    //   alias: "firstname"
    // },
    // rc_tag: [{ type: Types.ObjectId, ref: rc_tag }]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

rc_userSchema.virtual("fullname").get(function () {
  if (this.firstname !== undefined) return this.firstname + " " + this.lastname;
  else return "";
});
// .set(function (value) {
//     this.firstname = value.substr(0, value.indexOf(' '));
//     this.lastname = value.substr(value.indexOf(' ') + 1);
// });

// Virtual for URL
rc_userSchema.virtual("url").get(function () {
  return "/rc_user/" + this.username;
});

// rc_userSchema.virtual('rc_tag').
//     get(function () { return this.rc_tag }).
//     set(function (value) {});

var rc_user = (module.exports = mongoose.model("rc_user", rc_userSchema));

module.exports.createrc_user = function (newrc_user, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newrc_user.password, salt, function (err, hash) {
      newrc_user.password = hash;
      newrc_user.save(callback);
    });
  });
};

module.exports.getrc_userByusername = function (username, callback) {
  var query = { username: username };
  rc_user.findOne(query, callback);
};

module.exports.getrc_userById = function (id, callback) {
  rc_user.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
