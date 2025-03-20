const { Router } = require("express");
const usersController = require("../controllers/usersController");
const { isAuthenticated } = require("../controllers/authicateController");
const postsController = require("../controllers/postsController");
const postsRouter = require("./postsRouter");
const notificationsRouter = require("./notificationsRouter");
const usersRouter = Router();


// Unprotected routes

usersRouter.post("/", usersController.postNewUser);

usersRouter.post("/login", usersController.postLogin);


// Check if user is already authenticated if they try to access /login route (which is unnecessary)

usersRouter.get("/login", isAuthenticated, (req, res) => {
    res.json({authenticated: true})
});


// Apply Authenticate Controller for the following protected routes

usersRouter.use(isAuthenticated, (req, res, next) => {
    next();
});



// GET requests

usersRouter.get("/:user_id", usersController.getUserInfo);

usersRouter.get("/:user_id/following", usersController.getUserFollowing);

usersRouter.get("/:user_id/followers", usersController.getUserFollowers);

usersRouter.get("/:user_id/likes", usersController.getUserLikedPosts);

// gets all profile-related data for a user
usersRouter.get("/:handle/profile", 
    usersController.getUserInfo, 
    usersController.getUserFollowing, 
    usersController.getUserFollowers, 
    usersController.getUserLikedPosts,
    postsController.getUserPosts,
    postsController.getUserReplies,
    
    (req, res) => {
        res.json({
            userInfo: res.locals.userInfo,
            followers: res.locals.followers,
            following: res.locals.following,
            likedPosts: res.locals.likedPosts,
            posts: res.locals.userPosts,
            replies: res.locals.userReplies
        })
    }
);



// POST/DELETE/PUT requests

usersRouter.post("/:user_id/logout", usersController.postLogout);

usersRouter.put("/:user_id", usersController.putEditedUserInfo);

usersRouter.post("/:user_id/likes/:post_id/:author_id", usersController.postLike);

usersRouter.post("/:user_id/following/:followed_user_id", usersController.postFollow);

// use this route when someone unfollows a user
usersRouter.delete("/:user_id/following/:followed_user_id", usersController.deleteFollow);

// use this route when someone unlikes a post
usersRouter.delete("/:user_id/likes/:post_id", usersController.deleteLike);



// use postsRouter for posts-related paths

usersRouter.use("/:user_id/posts", postsRouter);



// use notificationsRouter for notifications

usersRouter.use("/:user_id/notifications", notificationsRouter);



module.exports = usersRouter;