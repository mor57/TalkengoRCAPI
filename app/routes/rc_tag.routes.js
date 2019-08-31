module.exports = app => {
    const rc_tag = require("../controllers/rc_tag.controller");

    //imports Passport and the JsonWebToken library for some utilities
    const passport = require("passport");

    // Create a new rc_tag ,authorize
    app.post(
        "/rc_tag",
        passport.authenticate("jwt", { session: false }),
        rc_tag.create
    );

    // Retrieve all rc_tag ,authorize
    app.get(
        "/rc_tag",
        // passport.authenticate("jwt", { session: false }),
        rc_tag.findAll
    );

    // Retrieve all rc_tag with resource count ,authorize
    app.get(
        "/rc_tag/hasresource/:role",
        // passport.authenticate("jwt", { session: false }),
        rc_tag.findAllHasresource
    );

    // Retrieve a single rc_tag with tagId ,authorize
    app.get(
        "/rc_tag/:tagId",
        passport.authenticate("jwt", { session: false }),
        rc_tag.findOne
    );

    // Update a rc_tag with tagId ,authorize
    app.put(
        "/rc_tag/:tagId",
        passport.authenticate("jwt", { session: false }),
        rc_tag.update
    );

    // Delete a rc_tag with tagId ,authorize
    app.delete(
        "/rc_tag/:tagId",
        passport.authenticate("jwt", { session: false }),
        rc_tag.delete
    );
};