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



// Sanitization / Validation

const validate = [
    body("content")
    .trim()
    .isLength({max:500})
    .withMessage("Content cannot be more than 500 characters.")
]


// POST requests

const postNewPost = [
    validate,

    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            validationErrors: errors.mapped()
          });
        }
        next();
    },

    asyncHandler(async (req, res) => {
        await postDB.createPost({
            author_id: req.params.user_id,
            date_created: new Date(),
            content: req.body.content
        });

        res.json({createPostSuccess: true});
    })
]



const postNewReply = [
    validate,

    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            validationErrors: errors.mapped()
          });
        }
        next();
    },

    asyncHandler(async (req, res) => {
        await replyDB.createReply({
            author_id: req.params.user_id,
            date_created: new Date(),
            content: req.body.content,
            parent_post_id: req.params.post_id
        });
    
        res.json({createReplySuccess: true});
    })
]



const postNewRepost = asyncHandler(async (req, res) => {
    await repostDB.createRepost({
        parent_post_id: req.params.post_id,
        user_id: req.params.user_id
    });

    res.json({createRepostSuccess: true});
});



const deleteRepost = asyncHandler(async (req, res) => {
    await repostDB.deleteRepost({
        user_id: req.params.user_id,
        parent_post_id: req.params.post_id
    });

    res.json({deleteRepostSuccess: true});
});



const postNewQuoteRepost = [
    validate,

    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            validationErrors: errors.mapped()
          });
        }
        next();
    },

    asyncHandler(async (req, res) => {
        await quoteRepostDB.createQuoteRepost({
            author_id: req.params.user_id,
            date_created: new Date(),
            content: req.body.content,
            parent_post_id: req.params.post_id
        });
    
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