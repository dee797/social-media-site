const { prisma } = require("../../client");


const createUser = async (user) => {
    return await prisma.user.create({ 
        data: {
            name: user.name,
            handle: user.handle,
            password: user.password,
            bio: user.bio,
            profilePicURL: user.profilePicURL,
            bannerPicURL: user.bannerPicURL,
            dateJoined: user.dateJoined,
        }  
    });
}

const getUserByHandle = async (userHandle) => {
    const user = await prisma.user.findUnique({
        where: { handle: userHandle }
    });
    return user;
}


const updateUser = async (user) => {
    return await prisma.user.update({
        where: { userID: user.userID },
        data: user
    })
}


const deleteUser = async (user) => {
    return await prisma.user.delete({
        where: { userID: user.userID }
    });
}


module.exports = {
    createUser,
    getUserByHandle,
    updateUser,
    deleteUser
}