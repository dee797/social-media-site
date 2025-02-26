const { Router } = require("express");
const usersController = require("../controllers/usersController");
const { isAuthenticated } = require("../controllers/authicateController");
const postsController = require("../controllers/postsController");
const postsRouter = require("./postsRouter");
const usersRouter = Router();


// Unprotected routes

usersRouter.post("/", usersController.postNewUser);

usersRouter.post("/login", usersController.postLogin);



// Apply Authenticate Controller for the following protected routes

usersRouter.use(isAuthenticated, (req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});



// GET requests

usersRouter.get("/:user_id", usersController.getUserInfo);

usersRouter.get("/:user_id/following", usersController.getUserFollowing);

usersRouter.get("/:user_id/followers", usersController.getUserFollowers);

usersRouter.get("/:user_id/likes", usersController.getUserLikedPosts);

// gets all profile-related data for a user
usersRouter.get("/:user_id/profile", 
    usersController.getUserInfo, 
    usersController.getUserFollowing, 
    usersController.getUserFollowers, 
    usersController.getUserLikedPosts,
    postsController.getUserPosts,
    postsController.getUserReplies,
    
    (req, res) => {
        res.json({
            userInfo: res.locals.userInfo,
            following: res.locals.followers,
            following: res.locals.following,
            likedPosts: res.locals.likedPosts,
            userPosts: res.locals.userPosts,
            userReplies: res.locals.userReplies
        })
    }
);



// POST/DELETE/PUT requests

usersRouter.post("/logout", usersController.postLogout);

usersRouter.put("/:user_id", usersController.putEditedUserInfo);

// use this route when someone unfollows a user
usersRouter.delete("/:user_id/following/:followed_user_id", usersController.deleteFollow);

// use this route when someone unlikes a post
usersRouter.delete("/:user_id/likes/:post_id", usersController.deleteLike);



// use postsRouter for posts-related paths

usersRouter.use("/:user_id/posts", postsRouter);


module.exports = usersRouter;