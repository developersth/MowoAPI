const passport = require('passport'),
  passportJWT = require("passport-jwt"),
  ExtractJWT = passportJWT.ExtractJwt,
  JWTStrategy = passportJWT.Strategy,
  LocalStrategy = require('passport-local').Strategy
  const env = require('./env');
// Mock Data
const user = {
  id: 1,
  sub: 'admin_dev',
  username: env.api_auth.username,
  password:  env.api_auth.password,
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  (username, password, cb) => {

    //this one is typically a DB call.
    if (username !== user.username || password !== user.password)
      return cb(null, false, { message: 'Incorrect email or password.' })
    else
      return cb(null, user, { message: 'Logged In Successfully' })
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
},
  (jwtPayload, cb) => {

    try {
      // find the user in db if needed
      if (jwtPayload.id == user.id) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    } catch (error) {
      return cb(error, false);
    }
  }
));