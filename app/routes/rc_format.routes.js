module.exports = app => {
  const rc_format = require("../controllers/rc_format.controller");

  //imports Passport and the JsonWebToken library for some utilities
  const passport = require("passport");

  // Create a new rc_format ,authorize
  app.post(
    "/rc_format",
    passport.authenticate("jwt", { session: false }),
    rc_format.create
  );

  // Retrieve all rc_format ,authorize
  app.get(
    "/rc_format",
    passport.authenticate("jwt", { session: false }),
    rc_format.findAll
  );

  // Retrieve a single rc_format with formatId ,authorize
  app.get(
    "/rc_format/:formatId",
    passport.authenticate("jwt", { session: false }),
    rc_format.findOne
  );

  // Update a rc_format with formatId ,authorize
  app.put(
    "/rc_format/:formatId",
    passport.authenticate("jwt", { session: false }),
    rc_format.update
  );

  // Delete a rc_format with formatId ,authorize
  app.delete(
    "/rc_format/:formatId",
    passport.authenticate("jwt", { session: false }),
    rc_format.delete
  );
};
