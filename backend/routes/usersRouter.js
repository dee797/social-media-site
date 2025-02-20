const { Router } = require("express");
const usersController = require("../controllers/usersController");
const postsRouter = require("./postsRouter");
const usersRouter = Router();
// users/replies,


// GET requests

usersRouter.get("/:user_id", usersController.getUser);

usersRouter.get("/:user_id/profile", usersController.getUserProfile);

usersRouter.get("/:user_id/following", usersController.getUserFollowing);

usersRouter.get("/:user_id/followers", usersController.getUserFollowers);

usersRouter.get("/:user_id/likes", usersController.getUserLikedPosts);


// POST requests

usersRouter.post("/login", usersController.postLogin);

usersRouter.post("/new_user", usersController.postNewUser);

usersRouter.post("/:user_id/profile/edit", usersController.postEditUserProfile);

usersRouter.post("/:user_id/change_password", usersController.postChangeUserPassword);

usersRouter.post("/:user_id/delete", usersController.postDeleteUser);


// Use postsRouter for posts-related paths

usersRouter.use("/:user_id/posts", postsRouter);


module.exports = usersRouter;