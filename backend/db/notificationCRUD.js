const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const createNotification = async (notification) => {
    return await prisma.notification.create({ 
        data: {
            receiver_id: notification.receiver_id,
            sender_id: notification.sender_id,
            source_url: notification.source_url,
            type_id: notification.type_id
        }  
    });
}

const getNotifications = async (user) => {
    const notifications = await prisma.notification.findMany({
        where: {
            receiver_id: user.user_id
        }, 
        select: {
            notification_id: true,
            receiver_id: true, 
            sender_id: true,
            source_url: true,
            type_id: true,
            read_status: true,
            type: {
                select: {
                    type: true
                }
            },
            sender: {
                select: {
                    name: true,
                    handle: true
                }
            }
        },
        orderBy: {
            notification_id: "desc"
        }
    });
    return notifications;
}

const getNotification = async (notification) => {
    const findNotification = await prisma.notification.findUnique({
        where: { notification_id: notification.notification_id }
    });
    return findNotification;
}

const getNotificationByFields = async (data) => {
    const findNotification = await prisma.$queryRaw`
        select * from "Notification" 
        where receiver_id = ${data.receiver_id}
        and sender_id = ${data.sender_id}
        and source_url = ${data.source_url}
        and type_id = ${data.type_id};
    `;
    
    return findNotification.length ? findNotification : null;
}


const updateNotification = async (notification) => {
    return await prisma.notification.update({
        where: { notification_id: notification.notification_id },
        data: { read_status: true }
    });
}


const updateAllNotifications = async (user) => {
    return await prisma.notification.updateMany({
        where: { receiver_id: user.user_id },
        data: { read_status: true }
    });
}


module.exports = {
    createNotification,
    getNotifications,
    getNotification,
    getNotificationByFields,
    updateNotification,
    updateAllNotifications
}