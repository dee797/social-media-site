require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// imports for validation
const validationController = require("../controllers/validationController");
const { body, check } = require("express-validator");

// imports for working with tables in database
const userDB = require("../db/userCRUD");
const followDB = require("../db/followCRUD");
const likeDB = require("../db/likeCRUD");
const postDB = require("../db/postCRUD");
const notificationDB = require("../db/notificationCRUD");

// multer setup
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});
const uploadHandler = require('../config/cloudinaryHelper');



// GET requests

const getUserInfo = asyncHandler(async (req, res, next) => {
  let user;

  if (req.params.user_id) {
    user = await userDB.getUserByID({user_id: parseInt(req.params.user_id)});
  } else if (req.params.handle) {
    user = await userDB.getUserByHandle({handle: '@' + req.params.handle});
  }

  if (!user) return res.status(404).json({error: "404 - Not Found"});

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
    return next();
  } else {
    res.json(userInfo);
  }
});



const getUserFollowing = asyncHandler(async (req, res, next) => {
  const userId = res.locals.userInfo && res.locals.userInfo.user_id;

  const following = await followDB.getFollowing({user_id: userId || parseInt(req.params.user_id)});

  if (!following) return next();

  if (req.path.includes("/profile")) {
    res.locals.following = following;
    return next();
  } else {
    res.json(following);
  }
});



const getUserFollowers = asyncHandler(async (req, res, next) => {
  const userId = res.locals.userInfo && res.locals.userInfo.user_id;

  const followers = await followDB.getFollowers({user_id: userId || parseInt(req.params.user_id)});

  if (!followers) return next();

  if (req.path.includes("/profile")) {
    res.locals.followers = followers;
    return next();
  } else {
    res.json(followers);
  }
});



const getUserLikedPosts = asyncHandler(async (req, res, next) => {
  const userId = res.locals.userInfo && res.locals.userInfo.user_id;
  
  const likedPosts = await likeDB.getLikedPosts({user_id: userId || parseInt(req.params.user_id)});

  if (!likedPosts) return next();

  for (const post of likedPosts) {
    const {numLikes, numReposts, numReplies} = await postDB.getCounts({post_id: post.post.post_id});
    post.post.numLikes = numLikes;
    post.post.numReplies = numReplies;
    post.post.numReposts = numReposts;
  }

  if (req.path.includes("/profile")) {
    res.locals.likedPosts = likedPosts;
    return next();
  } else {
    res.json(likedPosts);
  }
});



// Sanitization / Validation

const validationChain = [
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

const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Only PNGs and JPEGs are allowed');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File size cannot be more than 2MB');
  }

  return true;
}



// POST / other requests

const postNewUser = [
  validationChain,

  validationController,

  asyncHandler(async (req, res) => {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userDB.createUser({
          name: req.body.name,
          handle: '@' + req.body.username, 
          password: hashedPassword,
          bio: '',
          profile_pic_url: process.env.DEFAULT_AVATAR_URL,
          banner_pic_url: process.env.DEFAULT_BANNER_URL,
          date_joined: new Date(),
          token_valid_after: Math.floor(Date.now() / 1000)
      });
      
      res.status(201).json({signupSuccess: true});
  })
];



const postLogin = (req, res, next) => {
  passport.authenticate("local", {session: false}, (err, user, info) => {
      if (err) return next(err)
      if (!user) {
          return res.status(401).json({ message: info.message });
      }
      
      req.login(user, {session: false}, (err) => {
          if (err) return next(err);

          const token = jwt.sign({sub: user.userInfo.user_id}, process.env.SECRET, { expiresIn: '2h'});

          return res.json({
            user: user, 
            loginSuccess: true, 
            token
        });
      });
  })(req, res, next);
};



const postLogout = asyncHandler(async (req, res, next) => {
  await userDB.updateUser({
    user_id: parseInt(req.params.user_id),
    token_valid_after: Math.floor(Date.now()/ 1000)
  })
  
  res.json({logoutSuccess: true});
});
  


const putEditedUserInfo = [
  upload.fields([
    { name: 'profile_pic', maxCount: 1 }, 
    { name: 'banner_pic', maxCount: 1 }
  ]),
  
  validationChain[0],

  body("bio")
  .optional()
  .trim()
  .isLength({max:500})
  .withMessage("Bio cannot be more than 500 characters."),

  check('profile_pic')
  .custom((value, {req}) => {
    if (value === "null") return true;
    return validateFile(req.files.profile_pic[0]);
  }),

  check('banner_pic')
  .custom((value, {req}) => {
    if (value === "null") return true;
    return validateFile(req.files.banner_pic[0]);
  }),

  validationController,

  asyncHandler(async (req, res) => {
    let profile_pic_url;
    let banner_pic_url;

    if (req.files?.profile_pic?.length) {
      profile_pic_url = await uploadHandler(req.files.profile_pic[0]);
    }

    if (req.files?.banner_pic?.length) {
      banner_pic_url = await uploadHandler(req.files.banner_pic[0]);
    }

    const {name, bio} = req.body;
    await userDB.updateUser({
      user_id: parseInt(req.params.user_id),
      name,
      bio,
      profile_pic_url: profile_pic_url ?? undefined,
      banner_pic_url: banner_pic_url ?? undefined
    });
    res.json({updateSuccess: true});
  })
];



const postLike = asyncHandler(async (req, res) => {
  await likeDB.createLike({
    post_id: parseInt(req.params.post_id),
    user_id: parseInt(req.params.user_id)
  });

  const foundNotification = await notificationDB.getNotificationByFields({
    receiver_id: parseInt(req.params.author_id),
    sender_id: parseInt(req.params.user_id),
    source_url: `/post/${req.params.post_id}`,
    type_id: 1
  });

  if (req.params.author_id !== req.params.user_id && !foundNotification) {
    await notificationDB.createNotification({
      receiver_id: parseInt(req.params.author_id),
      sender_id: parseInt(req.params.user_id),
      source_url: `/post/${req.params.post_id}`,
      type_id: 1
    });
  }

  res.json({createLikeSuccess: true});
});



const postFollow = asyncHandler(async (req, res) => {
  await followDB.createFollow({
    followed_user_id: parseInt(req.params.followed_user_id),
    follower_id: parseInt(req.params.user_id)
  });

  const user = await userDB.getUserByID({user_id: parseInt(req.params.user_id)})

  const foundNotification = await notificationDB.getNotificationByFields({
    receiver_id: parseInt(req.params.followed_user_id),
    sender_id: parseInt(req.params.user_id),
    source_url: `/user/${user.handle.slice(1)}`,
    type_id: 2
  })

  if (!foundNotification) {
    await notificationDB.createNotification({
      receiver_id: parseInt(req.params.followed_user_id),
      sender_id: parseInt(req.params.user_id),
      source_url: `/user/${user.handle.slice(1)}`,
      type_id: 2
    });
  }

  res.json({createFollowSuccess: true})
});



const deleteFollow = asyncHandler(async (req, res) => {
  await followDB.deleteFollow({
    follower_id: parseInt(req.params.user_id),
    followed_user_id: parseInt(req.params.followed_user_id)
  });

  res.json({deleteFollowSuccess: true});
});



const deleteLike = asyncHandler(async (req, res) => {
  await likeDB.deleteLike({
    user_id: parseInt(req.params.user_id),
    post_id: parseInt(req.params.post_id)
  });

  res.json({deleteLikeSucess: true});
})



module.exports = { 
  getUserInfo,
  getUserFollowing,
  getUserFollowers,
  getUserLikedPosts,
  postNewUser,
  postLogin,
  postLogout,
  putEditedUserInfo,
  postLike,
  postFollow,
  deleteFollow,
  deleteLike
}