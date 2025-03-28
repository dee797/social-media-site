const { PrismaClient } = require('@prisma/client');
const { getLikeCountForPost } = require('./likeCRUD');
const { getRepostCountForPost } = require('./repostCRUD');

const prisma = new PrismaClient();

const createReply = async (post) => {
    return await prisma.post.create({ 
        data: {            
            author_id: post.author_id, 
            date_created: post.date_created,   
            content: post.content,
            reply_parent: {
                create: { 
                    parent_post_id: post.parent_post_id,
                    user_id: post.author_id,
                }
            }
        }
    });
}

const getThread = async (post) => {
    const replies = await prisma.$queryRaw`
        with recursive replies as (
            select *
            from "Reply"
            where parent_post_id = ${post.post_id}
            union all
            select r.*
            from "Reply" r
                join replies re on re.reply_post_id = r.parent_post_id
        )
        select distinct p.* from "Post" p, replies 
        where p.post_id = replies.parent_post_id 
        or p.post_id = replies.reply_post_id
        order by p.date_created, p.post_id;
    `
    return replies;
}

const getParentOfReply = async (post) => {
    const parent = await prisma.reply.findFirst({
        where: { reply_post_id: post.post_id },
        select: { parent_post: {
            select: {
                post_id: true,
                author: {
                    select: {
                        name: true,
                        handle: true,
                        user_id: true
                    }
                }
            }
        } }
    });
    return parent;
}

const getReplyCount = async (post) => {
    const arr = await getThread(post);
    if (arr.length === 0 ) return arr.length;

    return arr.length - 1;
}

// gets all the replies a user has made, but not the entire reply thread for each one
const getUserReplies = async (user) => {
    const replies = await prisma.user.findUnique({
        where: { user_id: user.user_id },
        select: {
            replies: { 
                select: { 
                    reply_post: true, 
                    parent_post: { select: { post_id: true, author: { select: { name: true, handle: true, user_id: true }}}}
                }
            }
        }
    });
    return replies.replies;
}

const getUserReplyData = async (user) => {
    const replies = await getUserReplies({user_id: user.user_id});
    const userInfo = await prisma.user.findUnique({
        where: { user_id : user.user_id },
        select: { 
            name: true,
            handle: true,
            user_id: true,
            profile_pic_url: true
        }
    });

    for (const reply of replies) {
        const numLikes = await getLikeCountForPost({post_id: reply.reply_post.post_id});
        const numReposts = await getRepostCountForPost({post_id: reply.reply_post.post_id});
        const numReplies = await getReplyCount({post_id: reply.reply_post.post_id});
    
        reply.numLikes = numLikes;
        reply.numReposts = numReposts;
        reply.numReplies = numReplies;

        reply.author = {};

        reply.author.name = userInfo.name;
        reply.author.handle = userInfo.handle;
        reply.author.user_id = userInfo.user_id;
        reply.author.profile_pic_url = userInfo.profile_pic_url;
    }

    const arr = replies;

    // sort records in arr by most recent date
    arr.sort((a,b) => {
        let aDate = a.reply_post.date_created;
        let bDate = b.reply_post.date_created;

        return new Date(bDate) - new Date(aDate);
    });

    return replies;
}


module.exports = {
    createReply,
    getThread,
    getParentOfReply,
    getReplyCount,
    getUserReplies,
    getUserReplyData
}