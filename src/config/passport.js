const JwtStrategy = require("passport-jwt").Strategy;
const BearerStrategy = require("passport-http-bearer");
const AnonymousStrategy = require("passport-anonymous").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { jwtSecret } = require("./vars");
const authProviders = require("../api/services/authProviders.service");
const { User } = require("../api/models");

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.get(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.anonymous = new AnonymousStrategy();
exports.jwt = new JwtStrategy(jwtOptions, jwt);
