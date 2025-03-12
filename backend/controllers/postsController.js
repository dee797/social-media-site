const { body } = require("express-validator");
const asyncHandler = require("express-async-handler");

const postDB = require("../db/postCRUD");
const replyDB = require("../db/replyCRUD");
const repostDB = require("../db/repostCRUD");
const quoteRepostDB = require("../db/quoteRepostCRUD");
const notificationDB = require("../db/notificationCRUD");

const validationController = require("../controllers/validationController");



// GET requests

const getUserPosts = asyncHandler(async (req, res, next) => {
    const userId = res.locals.userInfo && res.locals.userInfo.user_id;

    const posts = await postDB.getUserPostData({
        user_id: userId || parseInt(req.params.user_id)
    });

    if (req.path.includes("/profile")) {
        res.locals.userPosts = posts;
        return next();
    } else {
        res.json(posts);
    }
});



const getPostData = asyncHandler(async (req, res, next) => {
    const post = await postDB.getPostData({
        post_id: parseInt(req.params.post_id)
    });

    if (!post) return next();
    res.json(post);
});



const getUserReplies = asyncHandler(async (req, res, next) => {
    const userId = res.locals.userInfo && res.locals.userInfo.user_id;

    const replies = await replyDB.getUserReplyData({
        user_id: userId || parseInt(req.params.user_id)
    });

    if (req.path.includes("/profile")) {
        res.locals.userReplies = replies;
        return next();
    } else {
        res.json(replies);
    }
});



// Sanitization / Validation

const validationChain = [
    body("content")
    .trim()
    .isLength({max:500})
    .withMessage("Content cannot be more than 500 characters.")
]


// POST requests

const postNewPost = [
    validationChain,

    validationController,

    asyncHandler(async (req, res) => {
        await postDB.createPost({
            author_id: parseInt(req.params.user_id),
            date_created: new Date(),
            content: req.body.content
        });

        res.json({createPostSuccess: true});
    })
]



const postNewReply = [
    validationChain,

    validationController,

    asyncHandler(async (req, res) => {
        await replyDB.createReply({
            author_id: parseInt(req.params.user_id),
            date_created: new Date(),
            content: req.body.content,
            parent_post_id: parseInt(req.params.post_id)
        });

        if (req.params.user_id !== req.params.author_id) {
            await notificationDB.createNotification({
                receiver_id: parseInt(req.params.author_id),
                sender_id: parseInt(req.params.user_id),
                source_url: `/users/${req.params.author_id}/posts/${req.params.post_id}`,
                type_id: 4
            });
        }
    
        res.json({createReplySuccess: true});
    })
]



const postNewRepost = asyncHandler(async (req, res) => {
    await repostDB.createRepost({
        parent_post_id: parseInt(req.params.post_id),
        user_id: parseInt(req.params.user_id)
    });

    if (req.params.user_id !== req.params.author_id) {
        await notificationDB.createNotification({
            receiver_id: parseInt(req.params.author_id),
            sender_id: parseInt(req.params.user_id),
            source_url: `/users/${req.params.author_id}/posts/${req.params.post_id}`,
            type_id: 3
        });
    }
    res.json({createRepostSuccess: true});
});



const deleteRepost = asyncHandler(async (req, res) => {
    await repostDB.deleteRepost({
        user_id: parseInt(req.params.user_id),
        parent_post_id: parseInt(req.params.post_id)
    });

    res.json({deleteRepostSuccess: true});
});



const postNewQuoteRepost = [
    validationChain,

    validationController,

    asyncHandler(async (req, res) => {
        await quoteRepostDB.createQuoteRepost({
            author_id: parseInt(req.params.user_id),
            date_created: new Date(),
            content: req.body.content,
            parent_post_id: parseInt(req.params.post_id)
        });

        if (req.params.user_id !== req.params.author_id) {
            await notificationDB.createNotification({
                receiver_id: parseInt(req.params.author_id),
                sender_id: parseInt(req.params.user_id),
                source_url: `/users/${req.params.user_id}/posts/${req.params.post_id}`,
                type_id: 3
            });
        }
        res.json({createQuoteRepostSuccess: true})
    })
];



module.exports = {
    getUserPosts,
    getPostData,
    getUserReplies,
    postNewPost,
    postNewReply,
    postNewRepost,
    deleteRepost,
    postNewQuoteRepost
}