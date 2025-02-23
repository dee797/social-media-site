require('dotenv').config();
const db = require('../db/userCRUD');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use("local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.getUserByHandle({handle: '@' + username});
  
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        return done(null, user);

      } catch(err) {
        return done(err);
      }
    })
  );


passport.use("jwt",
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET
    },
    (jwtPayload, done) => {

    return db.getUserByID({ user_id: jwtPayload.sub })
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
    }
));