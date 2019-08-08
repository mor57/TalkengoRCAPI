module.exports = app => {
  const rc_resource = require("../controllers/rc_resource.controller");

  //imports Passport and the JsonWebToken library for some utilities
  const passport = require("passport");

  // Create a new rc_resource ,authorize
  app.post(
    "/rc_resource",
    passport.authenticate("jwt", { session: false }),
    rc_resource.create
  );

  // Retrieve all rc_resource ,authorize
  app.get(
    "/rc_resource",
    passport.authenticate("jwt", { session: false }),
    rc_resource.findAll
  );

  // Retrieve a single rc_resource with resourceId ,authorize
  app.get(
    "/rc_resource/:resourceId",
    passport.authenticate("jwt", { session: false }),
    rc_resource.findOne
  );

  // Update a rc_resource with resourceId ,authorize
  app.put(
    "/rc_resource/:resourceId",
    passport.authenticate("jwt", { session: false }),
    rc_resource.update
  );

  // Delete a rc_resource with resourceId ,authorize
  app.delete(
    "/rc_resource/:resourceId",
    passport.authenticate("jwt", { session: false }),
    rc_resource.delete
  );
};
