const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient();

const createUser = async (user) => {
    return await prisma.user.create({ 
        data: {
            name: user.name,
            handle: user.handle,
            password: user.password,
            bio: user.bio,
            profile_pic_url: user.profile_pic_url,
            banner_pic_url: user.banner_pic_url,
            date_joined: user.date_joined,
        }  
    });
}

const getUserByHandle = async (user) => {
    const findUser = await prisma.user.findUnique({
        where: { handle: user.handle }
    });
    return findUser;
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