require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const userDB = require("../db/userCRUD");
const followDB = require("../db/followCRUD");
const likeDB = require("../db/likeCRUD");
const postDB = require("../db/postCRUD");



// GET requests

const getUserInfo = asyncHandler(async (req, res, next) => {
  const user = await userDB.getUserByID({user_id: parseInt(req.params.user_id)});
  if (!user) next();

  const userInfo = {
    user_id: user.user_id,
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    profile_pic_url: user.profile_pic_url,
    banner_pic_url: user.banner_pic_url,
    date_joined: user.date_joined
  }

  if (req.path.includes("/profile")) {
    res.locals.userInfo = userInfo;
    next();
  } else {
    res.json(userInfo);
  }
});



const getUserFollowing = asyncHandler(async (req, res, next) => {
  const following = await followDB.getFollowing({user_id: parseInt(req.params.user_id)});

  if (!following) next();

  if (req.path.includes("/profile")) {
    res.locals.following = following;
    next();
  } else {
    res.json(following);
  }
});



const getUserFollowers = asyncHandler(async (req, res, next) => {
  const followers = await followDB.getFollowers({user_id: parseInt(req.params.user_id)});

  if (!followers) next();

  if (req.path.includes("/profile")) {
    res.locals.followers = followers;
    next();
  } else {
    res.json(followers);
  }
});



const getUserLikedPosts = asyncHandler(async (req, res, next) => {
  const likedPosts = await likeDB.getLikedPosts({user_id: parseInt(req.params.user_id)});

  if (!likedPosts) next();

  for (const post of likedPosts) {
    const {numLikes, numReposts, numReplies} = await postDB.getCounts({post_id: post.post.post_id});
    post.post.numLikes = numLikes;
    post.post.numReplies = numReplies;
    post.post.numReposts = numReposts;
  }

  if (req.path.includes("/profile")) {
    res.json({
      userInfo: res.locals.userInfo, 
      following: res.locals.following,
      followers: res.locals.followers,
      likedPosts: likedPosts
    });
  } else {
    res.json(likedPosts);
  }
});


// Sanitization / Validation

const validate = [
  body("name")
    .trim()
    .isLength({ max:25 })
    .withMessage("Name cannot be more than 25 characters"),

  body("username")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Username must be between 1 and 25 characters.")
    .custom(async username => {
      const user = await userDB.getUserByHandle({handle: '@' + username});
      if (user) { 
        throw new Error("Username already in use.");
      }
    }),

  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1, 
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false
    })
    .withMessage("Password does not meet the requirements."),

  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords do not match.`)
];



// POST / other requests

const postNewUser = [
  (req, res, next) => {
    if (res.app.locals.currentUser) return res.json({authenticated: true});
    next();
  },

  validate,

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        validationErrors: errors.mapped()
      });
    }
    next();
  },

  asyncHandler(async (req, res) => {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userDB.createUser({
          name: req.body.name,
          handle: '@' + req.body.username, 
          password: hashedPassword,
          bio: '',
          profile_pic_url: '',
          banner_pic_url: '',
          date_joined: new Date(),
          token_valid_after: Math.floor(Date.now() / 1000)
      });
      
      res.status(201).json({signupSuccess: true});
  })
];



const postLogin = (req, res, next) => {
  if (res.app.locals.currentUser) return res.json({authenticated: true});

  passport.authenticate("local", {session: false}, (err, user, info) => {
      if (err) return next(err)
      if (!user) {
          return res.json({ message: info.message });
      }
      
      req.login(user, {session: false}, (err) => {
          if (err) return next(err);

          res.app.locals.currentUser = req.user;
          const token = jwt.sign({sub: user.user_id}, process.env.SECRET, { expiresIn: '2h'});
          // On frontend, if loginSuccess === true then redirect to home path ("/")
          return res.json({current_user_id: user.user_id, loginSuccess: true, token});
      });
  })(req, res, next);
};



const postLogout = asyncHandler(async (req, res, next) => {
  await userDB.updateUser({
    user_id: res.app.locals.currentUser.user_id,
    token_valid_after: Math.floor(Date.now()/ 1000)
  })
  delete res.app.locals.currentUser;
  
  // if logout success, delete jwt from localstorage on client side
  res.json({logoutSuccess: true});
});
  


const putEditedUserInfo = [
  validate[0],

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        validationErrors: errors.mapped()
      });
    }
    next();
  },

  asyncHandler(async (req, res) => {
    const {name, profile_pic_url, banner_pic_url, bio} = req.body;
    await userDB.updateUser({
      user_id: parseInt(req.params.user_id),
      name,
      profile_pic_url,
      banner_pic_url,
      bio
    });
    res.json({updateSuccess: true});
  })
];




module.exports = { 
  getUserInfo,
  getUserFollowing,
  getUserFollowers,
  getUserLikedPosts,
  postNewUser,
  postLogin,
  postLogout,
  putEditedUserInfo
}