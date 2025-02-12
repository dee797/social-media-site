const { prisma } = require("../../client");


const createUser = async (user) => {
    return await prisma.user.create({ 
        data: {
            name: user.name,
            handle: user.handle,
            password: user.password,
            bio: user.bio,
            profile_pic_url: user.profilePicURL,
            banner_pic_url: user.bannerPicURL,
            date_joined: user.dateJoined,
        }  
    });
}

const getUserByHandle = async (handle) => {
    const user = await prisma.user.findUnique({
        where: { handle: handle }
    });
    return user;
}


const updateUser = async (user) => {
    return await prisma.user.update({
        where: { user_id: user.user_id },
        data: user
    })
}


const deleteUser = async (user) => {
    return await prisma.user.delete({
        where: { user_id: user.user_id }
    });
}


module.exports = {
    createUser,
    getUserByHandle,
    updateUser,
    deleteUser
}