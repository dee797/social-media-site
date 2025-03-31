const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createQuoteRepost = async (post) => {
    return await prisma.post.create({ 
        data: {            
            author_id: post.author_id, 
            date_created: post.date_created,   
            content: post.content,
            quote_parent: {
                create: { 
                    parent_post_id: post.parent_post_id,
                    user_id: post.author_id,
                }
            }
        }
    });
}

const getParentOfQuote = async (post) => {
    const parent = await prisma.quote_Repost.findFirst({
        where: { quote_post_id: post.post_id },
        select: { parent_post: true }
    });
    return parent;
}

const getQuoteReposts = async (user) => {
    const posts = await prisma.quote_Repost.findMany({
        where: { user_id: user.user_id },
        select: {
            parent_post: { select: {
                post_id: true,
                content: true,
                date_created: true,
                author: { select: {
                    user_id: true,
                    name: true,
                    handle: true,
                    profile_pic_url: true
                }},
                reply_parent: {
                    select: {
                        parent_post: {
                            select: {
                                post_id: true,
                                author: {
                                    select: {
                                        user_id: true,
                                        name: true,
                                        handle: true
                                    }
                                }
                            }
                        }
                    }
                }
            }},
            quote_post: { select: {
                post_id: true,
                content: true,
                date_created: true,
                author: { select: {
                    user_id: true,
                    name: true,
                    handle: true,
                    profile_pic_url: true
                }}
            }}
        }
    });
    return posts;
}


module.exports = {
    createQuoteRepost,
    getParentOfQuote,
    getQuoteReposts
}