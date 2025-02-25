const { Router } = require("express");
const usersController = require("../controllers/usersController");
const { isAuthenticated } = require("../controllers/authicateController");
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

// this route is like the above four routes combined into one (it gets user info, following, followers, and likes)
// this route has been provided so that four separate fetch calls don't need to be made on the frontend
// however, the above four separate routes have been provided in the event that only one type of data is needed
usersRouter.get("/:user_id/profile", usersController.getUserInfo, usersController.getUserFollowing, usersController.getUserFollowers, usersController.getUserLikedPosts);



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