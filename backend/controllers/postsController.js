const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const postDB = require("../db/postCRUD");
const replyDB = require("../db/replyCRUD");
const repostDB = require("../db/repostCRUD");
const quoteRepostDB = require("../db/quoteRepostCRUD");



// GET requests

const getUserPosts = asyncHandler(async (req, res, next) => {
    const posts = await postDB.getUserPostData({
        user_id: parseInt(req.params.user_id)
    });

    if (req.path.includes("/profile")) {
        res.locals.userPosts = posts;
        next();
    } else {
        res.json(posts);
    }
});



const getPostData = asyncHandler(async (req, res, next) => {
    const post = await postDB.getPostData({
        post_id: parseInt(req.params.post_id)
    });

    if (!post) next();
    res.json(post);
});



const getUserReplies = asyncHandler(async (req, res, next) => {
    const replies = await replyDB.getUserReplyData({
        user_id: parseInt(req.params.user_id)
    });

    if (req.path.includes("/profile")) {
        res.locals.userReplies = replies;
        next();
    } else {
        res.json(replies);
    }
});



module.exports = {
    getUserPosts,
    getPostData,
    getUserReplies,
}