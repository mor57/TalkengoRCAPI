const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var cookieParser = require("cookie-parser");
var passport = require("passport");

// imports the File save requirement 
var multer = require('multer')
var path = require('path')
var DIR = './rc_uploads/';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var uploadresourcefile = multer({ storage: storage }).single('resourcefile');
// var uploadresourcefile = multer({ dest: DIR }).single('resourcefile');

const rc_resource = require("./app/controllers/rc_resource.controller");

//reads in configuration from a .env file
require("dotenv").config();

// create express app
const app = express();

app.use('/rc_uploads', express.static('rc_uploads'));

app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// app.use(cookieParser());

//custom Middleware for logging the each request going to the API
app.use((req, res, next) => {
  if (req.body) console.log(req.body);
  if (req.params) console.log(req.params);
  if (req.query) console.log(req.query);
  console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
  next();
});

// Passport init
app.use(passport.initialize());

//imports our configuration file which holds our verification callbacks and things like the secret for signing.
require("./config/passport-config")(passport);

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Require rc_resource routes
require("./app/routes/rc_resource.routes")(app);
// Require rc_cat routes
require("./app/routes/rc_cat.routes")(app);
// Require rc_format routes
require("./app/routes/rc_format.routes")(app);
// Require rc_tag routes
require("./app/routes/rc_tag.routes")(app);
//registers our authentication routes with Express.
require("./app/routes/rc_user.routes")(app);

// define a upload route
app.post('/rc_upload/:resourceId', (req, res, next) => {
  var path = '';
  return uploadresourcefile(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured")
    }
    // No error occured.
    path = req.file.path;
    rc_resource.updateFile(req, res);
    return res.json({
      success: true,
      message: "Upload Completed for " + path
    });
    // return res.send("Upload Completed for " + path);
  });
  // res.json({
  //   message: "Upload Completed for " + path
  // });
  // return res.send("Upload Completed for " + path);
})

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to TalkEngO.com application. Video Talk with native English speakers and learning English easily and natuarlly."
  });
});

// listen for requests
app.listen(3000, () => {
  console.log("CORS-enabled web server is listening on http://localhost:3000");
});
