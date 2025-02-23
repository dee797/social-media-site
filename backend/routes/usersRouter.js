const { Router } = require("express");
const usersController = require("../controllers/usersController");
const postsRouter = require("./postsRouter");
const usersRouter = Router();



// GET requests


usersRouter.get("/:user_id", usersController.getUserInfo);

usersRouter.get("/:user_id/following", usersController.getUserFollowing);

usersRouter.get("/:user_id/followers", usersController.getUserFollowers);

usersRouter.get("/:user_id/likes", usersController.getUserLikedPosts);


// this route is like the above four routes combined into one (it gets user info, following, followers, and likes)
// this route has been provided so that four separate fetch calls don't need to be made on the frontend
// however, the four separate routes have been provided in the event that only one of the above types of data are needed
usersRouter.get("/:user_id/profile", usersController.getUserInfo, usersController.getUserFollowing, usersController.getUserFollowers, usersController.getUserLikedPosts);



// POST/DELETE/PUT requests


usersRouter.post("/", usersController.postNewUser);

usersRouter.post("/login", usersController.postLogin);

usersRouter.post("/logout", usersController.postLogout);
/*
// this route can be used to change the user's password as well
usersRouter.put("/:user_id", usersController.putEditedUserInfo);

usersRouter.delete("/:user_id", usersController.deleteUser);

// use this route when someone unfollows a user
usersRouter.delete("/:user_id/following/:followed_user_id");

// use this route when someone unlikes a post
usersRouter.delete("/:user_id/likes/:post_id");



// use postsRouter for posts-related paths

usersRouter.use("/:user_id/posts", postsRouter);

*/
module.exports = usersRouter;