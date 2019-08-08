module.exports = app => {
  const rc_cat = require("../controllers/rc_cat.controller");

  //imports Passport and the JsonWebToken library for some utilities
  const passport = require("passport");

  // Create a new rc_cat ,authorize
  app.post(
    "/rc_cat",
    passport.authenticate("jwt", { session: false }),
    rc_cat.create
  );

  // Retrieve all rc_cat ,authorize
  app.get(
    "/rc_cat",
    passport.authenticate("jwt", { session: false }),
    rc_cat.findAll
  );

  // Retrieve a single rc_cat with catId ,authorize
  app.get(
    "/rc_cat/:catId",
    passport.authenticate("jwt", { session: false }),
    rc_cat.findOne
  );

  // Update a rc_cat with catId ,authorize
  app.put(
    "/rc_cat/:catId",
    passport.authenticate("jwt", { session: false }),
    rc_cat.update
  );

  // Delete a rc_cat with catId ,authorize
  app.delete(
    "/rc_cat/:catId",
    passport.authenticate("jwt", { session: false }),
    rc_cat.delete
  );
};
