const { Strategy, ExtractJwt } = require("passport-jwt");
//this is using ES6 Destructuring. If you're not using a build step,
//this could cause issues and is equivalent to
// const pp-jwt = require('passport-jwt');
// const Strategy = pp-jwt.Strategy;
// const ExtractJwt = pp-jwt.ExtractJwt;
require("dotenv").config();
const secret = process.env.SECRET || "some other secret as default";
const mongoose = require("mongoose");
const User = require("../app/models/rc_user.model");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};
//this sets how we handle tokens coming from the requests that come
// and also defines the key to be used when verifying the token.
module.exports = passport => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {
              id: user.id,
              role: user.role,
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              username: user.username
            });
          }
          return done(null, false);
        })
        .catch(err => console.error(err));
    })
  );
};
