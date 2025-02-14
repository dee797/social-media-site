const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createReply = async (post) => {
    return await prisma.post.create({ 
        data: {
            reply_parent: {
                create: { 
                    parent_post_id: post.parent_post_id,
                    user_id: post.author_id 
                }
            },
            author_id: post.author_id, 
            date_created: post.date_created,   
            content: post.content
        }
    });
}

const getReplies = async (post) => {
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


module.exports = {
    createReply,
    getReplies
}