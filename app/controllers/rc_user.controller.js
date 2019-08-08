//imports the user model and the BcryptJS Library
const rc_user = require("../models/rc_user.model");
// const rc_tag = require("../models/rc_tag.model");

// BcryptJS is a no setup encryption tool
const bcrypt = require("bcryptjs");
require("dotenv").config();

//gives us access to our environment variables
//and sets the secret object.
const secret = process.env.SECRET || "the default secret";

//imports Passport and the JsonWebToken library for some utilities
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Find a single user with a userId
exports.login = (req, res) => {
  var username = req.body.username;
  if (username === undefined) {
    username = req.body.email;
  }
  const password = req.body.password;
  var errors = "";
  rc_user.findOne({ username }).then(User => {
    if (!User) {
      errors = "No Account Found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, User.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: User._id,
          name: User.username
        };
        jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
          if (err)
            res.status(500).json({
              error: "Error signing token",
              raw: err
            });
          res.json({
            success: true,
            token: `${token}`
          });
        });
      } else {
        errors = "Password is incorrect";
        res.status(400).json(errors);
      }
    });
  });
};

// Get userProfile with a username
exports.userProfile = (req, res) => {
  var username = req.body.username;
  if (username === undefined) {
    username = req.body.email;
  }
  var errors = "";
  rc_user.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with username " + req.params.userId
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with username " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with username " + req.params.userId
      });
    });
};

// Create and Save a new user
exports.create = (req, res) => {
  rc_user.findOne({ username: req.body.username }).then(user => {
    if (user) {
      let error = "username Exists in Database.";
      return res
        .status(400)
        .json({ success: false, message: error, user: user });
    } else {
      const newUser = new rc_user({
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err));
        });
      });
    }
  });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  rc_user
    .find()
    //.populate('rc_tag')
    .exec(function (err, user) {
      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Products not found with given name "
          });
        }
        return res.status(500).send({
          message: "Error retrieving Products with given Company Id "
        });
      }
      res.send(user);
    });
  // .then(users => {
  //     res.send(users);
  // }).catch(err => {
  //     res.status(500).send({
  //         message: err.message || "Some error occurred while retrieving users."
  //     });
  // });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  rc_user
    .findById(req.params.userId)
    // .populate("rc_tag")
    // .exec(function (error, user) {
    //     res.json(user);
    // });
    // .populate({
    //     path: 'rc_tag',
    //     populate: {
    //         path: 'rc_tag.user'
    //     }
    // }).
    // exec(function (error, user) {
    //     res.json(user);
    // });
    // rc_user.findById(req.params.userId)
    //     // .exec(function (err, user) {
    //     //     res.send(user);
    //     // });
    //     .populate('rc_tag')
    //     .then((result) => {
    //         res.json(result);
    //     })
    //     .catch((error) => {
    //         res.status(500).json({ error });
    //     });
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId
      });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "user content can not be empty"
    });
  }

  // Find user and update it with the request body
  rc_user
    .findByIdAndUpdate(
      req.params.userId,
      {
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username
      },
      { new: true }
    )
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error updating user with id " + req.params.userId
      });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  rc_user
    .findByIdAndRemove(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send({ message: "user deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId
      });
    });
};
