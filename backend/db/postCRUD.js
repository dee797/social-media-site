const { PrismaClient } = require('@prisma/client')

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

const getUserPosts = async (user) => {
    const posts = await prisma.post.findMany({
        where: { author_id: user.user_id }
    });
    return posts;
}



module.exports = {
    createPost,
    getUserPosts
}