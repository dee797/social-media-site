const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();
// include users/posts, users/replies,


// GET requests
usersRouter.get("/", usersController.getAllUsers);

usersRouter.get("/:id", usersController.getUser);

usersRouter.get("/:id/profile", usersController.getUserProfile);

usersRouter.get("/:id/posts", usersController.getUserPosts);

usersRouter.get("/:id/posts/:id")

usersRouter.get("/:id/following", usersController.getUserFollowing);

usersRouter.get("/:id/followers", usersController.getUserFollowers);

usersRouter.get("/:id/likes", usersController.getUserLikedPosts);


// POST requests

usersRouter.post("/:id/profile/edit", usersController.postEditUserProfile);

usersRouter.post("/:id/change_password", usersController.postChangeUserPassword);

usersRouter.post("/:id/delete", usersController.postDeleteUser);

usersRouter.post("/:id/post")

