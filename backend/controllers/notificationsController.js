const notificationsDB = require("../db/notificationCRUD");
const asyncHandler = require('express-async-handler');


// GET requests

const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationsDB.getNotifications({
        user_id: parseInt(req.params.user_id)
    });

    let unreadNotifCount = 0;

    if (notifications.length > 0) {
        notifications.forEach(notification => {
            if (!notification.read_status) {
                unreadNotifCount += 1;
            }
        });                               
    }

    res.json({notificationList: notifications, unreadNotifCount});
});


// PUT requests

const updateAllUserNotifications = asyncHandler(async (req, res) => {
    await notificationsDB.updateAllNotifications({
        user_id: parseInt(req.params.user_id)
    });

    res.json({updateAllNotifs: true});
});


const updateUserNotification = asyncHandler(async (req, res) => {
    await notificationsDB.updateNotification({
        notification_id: parseInt(req.params.notification_id)
    });

    res.json({updatedNotif: true});
});



module.exports = {
    getUserNotifications,
    updateAllUserNotifications,
    updateUserNotification
}
