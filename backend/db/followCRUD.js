const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const createFollow = async (follow) => {
    return await prisma.follow.create({ 
        data: {
            followed_user_id: follow.followed_user_id,
            follower_id: follow.follower_id
        }  
    });
}

const getFollowers = async (user) => {
    const followers = await prisma.follow.findMany({
        where: { followed_user_id: user.user_id },
        select: { follower: true }
    });
    return followers;
}

const getFollowing = async (user) => {
    const following = await prisma.follow.findMany({
        where: { follower_id: user.user_id },
        select: { followed_user: true }
    });
    return following;
}

// This is the same as unfollowing someone
const deleteFollow = async (follow) => {
    return await prisma.follow.delete({
        where: { follower_id: follow.follower_id, 
                 followed_user_id: follow.followed_user_id
        }
    });
}



module.exports = {
    createFollow,
    getFollowers,
    getFollowing,
    deleteFollow
}