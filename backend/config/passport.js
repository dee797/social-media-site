require('dotenv').config();
const userDB = require('../db/userCRUD');
const followDB = require('../db/followCRUD');
const likeDB = require('../db/likeCRUD');
const postDB = require('../db/postCRUD');
const replyDB = require('../db/replyCRUD');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use("local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await userDB.getUserByHandle({handle: '@' + username});
  
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        userDB.updateUser({user_id: user.user_id, token_valid_after: Math.floor(Date.now() / 1000)})
        .then(async (updatedUser) => {
          try {
              const following = await followDB.getFollowing({user_id: updatedUser.user_id});
              const followers = await followDB.getFollowers({user_id: updatedUser.user_id});
              const likedPosts = await likeDB.getLikedPosts({user_id: updatedUser.user_id});
              const posts = await postDB.getUserPostData({user_id: updatedUser.user_id});
              const replies = await replyDB.getUserReplyData({user_id: updatedUser.user_id});

              if (following && followers && likedPosts && posts && replies) {
                done(null, {
                  userInfo: {
                    user_id: updatedUser.user_id,
                    name: updatedUser.name,
                    handle: updatedUser.handle,
                    bio: updatedUser.bio,
                    profile_pic_url: updatedUser.profile_pic_url,
                    banner_pic_url: updatedUser.banner_pic_url,
                    date_joined: updatedUser.date_joined
                  },
                  following: following,
                  followers: followers,
                  likedPosts: likedPosts,
                  posts: posts,
                  replies: replies
                });
              }
          } catch (err) {
            throw new Error(err);
          }
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
    async (jwtPayload, done) => {

    return userDB.getUserByID({ user_id: jwtPayload.sub })
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