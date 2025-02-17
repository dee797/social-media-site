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



module.exports = {
    createQuoteRepost,
    getParentOfQuote,
}