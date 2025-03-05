const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function main() {
    await prisma.follow.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.notification_Type.deleteMany({});
    await prisma.quote_Repost.deleteMany({});
    await prisma.reply.deleteMany({});
    await prisma.repost.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
}




module.exports = main;