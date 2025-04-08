const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const createLike = async (like) => {
    return await prisma.like.create({ 
        data: {
            post_id: like.post_id,
            user_id: like.user_id
        }  
    });
}

const getLikedPosts = async (user) => {
    const likes = await prisma.like.findMany({
        where: { user_id: user.user_id },
        select: { post: { select: {
            post_id: true,
            content: true,
            date_created: true,
            author: { select: {
                user_id: true,
                name: true,
                handle: true,
                profile_pic_url: true
            }},
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
        }}},
        orderBy: {
            post: {
                date_created: "desc"
            }
        }
    });
    return likes;
}

const getLikeCountForPost = async (post) => {
    const likeCount = await prisma.like.count({
        where: { post_id: post.post_id }
    });
    return likeCount
}

// This is the same as unliking a post
const deleteLike = async (like) => {
    return await prisma.$queryRaw`
        delete from "Like" where user_id = ${like.user_id} and post_id = ${like.post_id}
    `;
}



module.exports = {
    createLike,
    getLikedPosts,
    getLikeCountForPost,
    deleteLike
}