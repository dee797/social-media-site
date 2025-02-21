const { PrismaClient } = require('@prisma/client');
const { getReposts, getRepostCountForPost } = require('./repostCRUD');
const { getQuoteReposts } = require('./quoteRepostCRUD');
const { getLikeCountForPost } = require('./likeCRUD');
const { getReplyCount, getThread, getParentOfReply } = require('./replyCRUD');
const { getUserByID } = require('./userCRUD');

const prisma = new PrismaClient();

const createPost = async (post) => {
    return await prisma.post.create({ 
        data: {
            author_id: post.author_id,
            date_created: post.date_created,
            content: post.content
        }  
    });
}

// will get all posts, including reposts and quote reposts

const getUserPosts = async (user) => {
    const reposts = await getReposts({user_id: user.user_id});
    const quoteReposts = await getQuoteReposts({user_id: user.user_id});

    const posts = await prisma.$queryRaw`
        select distinct p.* from "Post" p, "Reply", "Quote_Repost"
        where p.post_id <> "Reply".reply_post_id
        and p.post_id <> "Quote_Repost".quote_post_id
        and p.post_id = ${user.user_id};
    `;

    const arr = Array.prototype.concat(reposts, quoteReposts, posts);

    // sort records in arr by most recent date
    arr.sort((a,b) => {
        let aDate;
        let bDate;

        if ('quote_post' in a ) {
            aDate = a.quote_post.date_created;
        } else if ('parent_post' in a) {
            aDate = a.parent_post.date_created;
        } else {
            aDate = a.date_created;
        }

        if ('quote_post' in b ) {
            bDate = b.quote_post.date_created;
        } else if ('parent_post' in b) {
            bDate = b.parent_post.date_created;
        } else {
            bDate = b.date_created;
        }

        return new Date(aDate) - new Date(bDate);
    });

    return arr;
}

const getUserPostData = async (user) => {
    const posts = await getUserPosts({user_id: user.user_id});

    for (const post of posts) {
        let post_id_value;

        if ('quote_post' in post) {
            post_id_value = post.quote_post.post_id;
        } else if ('parent_post' in post) {
            post_id_value = post.parent_post.post_id;
        } else {
            post_id_value = post.post_id;
        }

        const numLikes = await getLikeCountForPost({post_id: post_id_value});
        const numReposts = await getRepostCountForPost({post_id: post_id_value});
        const numReplies = await getReplyCount({post_id: post_id_value});

        post.numLikes = numLikes;
        post.numReposts = numReposts;
        post.numReplies = numReplies;
    }

    const userInfo = await getUserByID({user_id: user.user_id});

    const postData = { 
        name: userInfo.name, 
        username: userInfo.handle,
        posts: posts
    }

    return postData;
}

const getPostData = async (post) => {
    const thread = await getThread({post_id: post.post_id});

    if (!thread) return null;

    for (const part of thread) {
        const numLikes = await getLikeCountForPost({post_id: part.post_id});
        const numReposts = await getRepostCountForPost({post_id: part.post_id});
        const numReplies = await getReplyCount({post_id: part.post_id});

        const userInfo = await getUserByID({user_id: part.author_id});

        part.numLikes = numLikes;
        part.numReposts = numReposts;
        part.numReplies = numReplies;
        part.name = userInfo.name;
        part.username = userInfo.handle;
    }
    
    const parent = await getParentOfReply({post_id: post.post_id});
    const postData = {
        thread: thread,
        parent: parent
    }

    return postData;
}

module.exports = {
    createPost,
    getUserPosts,
    getUserPostData,
    getPostData
}