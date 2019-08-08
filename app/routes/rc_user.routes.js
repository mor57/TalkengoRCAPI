module.exports = app => {
  const users = require("../controllers/rc_user.controller");

  //imports Passport and the JsonWebToken library for some utilities
  const passport = require("passport");

  // Endpoint to register
  app.post("/register", users.create);

  // Endpoint to login
  app.post("/login", users.login);

  // Endpoint to logout
  app.get("/logout", function (req, res, next) {
    // this doesn't seem to be doing anything
    res.status(200).send({
      message: "Logout successed."
    });
    // res.redirect(`/`);
  });

  // Endpoint to userProfile
  app.get(
    "/userProfile"
    // , users.userProfile);
    ,
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
      // return user info
      res.json({ user: req.user });
    }
  );

  // Endpoint to get current user ,authorize
  app.get(
    "/userinfo",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
      // return user info
      res.json({ user: req.user });
    }
  );

  // Retrieve all users ,authorize
  app.get(
    "/users",
    passport.authenticate("jwt", { session: false }),
    users.findAll
  );

  // Retrieve a single rc_tag with tagId ,authorize
  app.get(
    "/users/:userId",
    passport.authenticate("jwt", { session: false }),
    users.findOne
  );
};
