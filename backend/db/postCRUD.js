const { PrismaClient } = require('@prisma/client');
const { getReposts, getRepostCountForPost } = require('./repostCRUD');
const { getQuoteReposts, getParentOfQuote } = require('./quoteRepostCRUD');
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
        select distinct p.* from "Post" p
        where not exists (
            select 1
            from "Reply"
            where p.post_id = "Reply".reply_post_id
            and "Reply".user_id = ${user.user_id}
        )
        and not exists (
            select 1
            from "Quote_Repost"
            where p.post_id = "Quote_Repost".quote_post_id
            and "Quote_Repost".user_id = ${user.user_id}
        )
        and p.author_id = ${user.user_id}
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

        return new Date(bDate) - new Date(aDate);
    });

    return arr;
}

const getUserPostData = async (user) => {
    const posts = await getUserPosts({user_id: user.user_id});
    const userInfo = await getUserByID({user_id: user.user_id});

    for (const post of posts) {
        let post_id_value;

        if ('quote_post' in post) {
            post_id_value = post.quote_post.post_id;
        } else if ('parent_post' in post) {
            post_id_value = post.parent_post.post_id;
        } else {
            post_id_value = post.post_id;
        }

       const {numLikes, numReplies, numReposts} = await getCounts({post_id: post_id_value});
       post.numLikes = numLikes;
       post.numReposts = numReposts;
       post.numReplies = numReplies;

       post.author = {};

       post.author.name = userInfo.name;
       post.author.handle = userInfo.handle;
       post.author.profile_pic_url = userInfo.profile_pic_url;
       post.author.user_id = userInfo.user_id;
    }

    return posts;
}

const getPostData = async (post) => {
    const thread = await getThread({post_id: post.post_id});
    const checkPost = await prisma.post.findUnique({
        where: { post_id: post.post_id }
    });

    if (thread.length === 0 && !checkPost) return null;
    if (thread.length === 0 && checkPost) thread.push(checkPost);

    for (const part of thread) {
        const {numLikes, numReplies, numReposts} = await getCounts(part);
        part.numLikes = numLikes;
        part.numReposts = numReposts;
        part.numReplies = numReplies;

        const userInfo = await getUserByID({user_id: part.author_id});
        part.name = userInfo.name;
        part.username = userInfo.handle;
        part.profile_pic_url = userInfo.profile_pic_url;
    }
    
    const replyParent = await getParentOfReply({post_id: post.post_id});
    const quoteParent = await getParentOfQuote({post_id: post.post_id})
    const postData = {
        thread: thread,
        replyParent,
        quoteParent
    }

    return postData;
}

const get10Posts = async () => {
    const posts = await prisma.post.findMany({
        take: 10,
        where: { reply_parent: {none: {}} },
        select: {
            post_id: true,
            author_id: true,
            author: {
                select: { 
                    user_id: true,
                    handle: true,
                    name: true,
                    profile_pic_url: true
                }
            },
            quote_parent: {
                select: {
                    parent_post: {
                        select: {
                            post_id: true,
                            content: true, 
                            date_created: true,
                            author: {
                                select: {
                                    user_id: true,
                                    handle: true,
                                    name: true,
                                    profile_pic_url: true
                                }
                            },
                            reply_parent: {
                                select: {
                                    parent_post: {
                                        select: {
                                            post_id: true,
                                            author: {
                                                select: {
                                                    user_id: true,
                                                    handle: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            content: true,
            date_created: true,
        }
    })

    for (const post of posts) {
        const {numLikes, numReposts, numReplies} = await getCounts(post);
        post.numLikes = numLikes;
        post.numReposts = numReposts;
        post.numReplies = numReplies;
    }

    return posts;
}

const getCounts = async (post) => {
    const numLikes = await getLikeCountForPost({post_id: post.post_id});
    const numReposts = await getRepostCountForPost({post_id: post.post_id});
    const numReplies = await getReplyCount({post_id: post.post_id});

    return {numLikes, numReposts, numReplies};
}

module.exports = {
    createPost,
    getUserPosts,
    getUserPostData,
    getPostData,
    get10Posts,
    getCounts
}