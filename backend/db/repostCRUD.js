const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const createRepost = async (repost) => {
    return await prisma.repost.create({ 
        data: {
            parent_post_id: repost.parent_post_id,
            user_id: repost.user_id
        }  
    });
}

const getReposts = async (user) => {
    const reposts = await prisma.repost.findMany({
        where: { user_id: user.user_id },
        select: { parent_post: {select:{
            post_id: true,
            content: true,
            date_created: true,
            author: { select: {
                user_id: true,
                name: true,
                handle: true,
                profile_pic_url: true
                }
            }
        }},
            
         }
    });
    return reposts;
}

// Repost count also includes the count for quote reposts
const getRepostCountForPost = async (post) => {
    const repostCount = await prisma.repost.count({
        where: { parent_post_id: post.post_id }
    });

    const quoteRepostCount = await prisma.quote_Repost.count({
        where: { parent_post_id: post.post_id }  
    })
    return repostCount + quoteRepostCount
}

// This is the same as removing your repost from someone else's post
const deleteRepost = async (repost) => {
    return await prisma.repost.delete({
        where: { user_id: repost.user_id, 
                 parent_post_id: repost.parent_post_id
        }
    });
}



module.exports = {
    createRepost,
    getReposts,
    getRepostCountForPost,
    deleteRepost
}