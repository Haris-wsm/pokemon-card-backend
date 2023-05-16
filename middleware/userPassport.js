const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Passport = require("passport").Passport;
const userPassport = new Passport();

const AccountModel = require("../models/account");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SALT,
};

userPassport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log(jwt_payload);
      const user = await AccountModel.findById(jwt_payload.id);

      console.log(user);
      if (!user) {
        return done(new Error("ไม่พบผู้ใช้ในระบบ"), null);
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  })
);

module.exports.isLogin = userPassport.authenticate("jwt", { session: false });
