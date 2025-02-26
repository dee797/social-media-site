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

        db.updateUser({user_id: user.user_id, token_valid_after: Math.floor(Date.now() / 1000)})
        .then((updatedUser) => {
          done(null, updatedUser)
        })
        .catch((err) => {
          done(err);
        });

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
          if (jwtPayload.iat < user.token_valid_after) {
            throw new Error("Invalid token.");
          }
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    }
));