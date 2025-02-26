const { Router } = require("express");
const postsController = require("../controllers/postsController");
const postsRouter = Router({mergeParams: true});


// GET requests

postsRouter.get("/", postsController.getUserPosts);

postsRouter.get("/replies", postsController.getUserReplies);

postsRouter.get("/:post_id", postsController.getPostData);



// POST/other requests

postsRouter.post("/", postsController.postNewPost);

postsRouter.post("/:post_id/replies", postsController.postNewReply);

postsRouter.post("/:post_id/repost", postsController.postNewRepost);

postsRouter.delete("/:post_id/repost", postsController.deleteRepost);

postsRouter.post("/:post_id/quote_repost", postsController.postNewQuoteRepost);


module.exports = postsRouter;
