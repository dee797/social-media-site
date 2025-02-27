const { Router } = require("express");
const notificationsRouter = Router({mergeParams: true});
const notificationsController = require("../controllers/notificationsController");

notificationsRouter.get("/", notificationsController.getUserNotifications);
notificationsRouter.put("/", notificationsController.updateAllUserNotifications)
notificationsRouter.put("/:notification_id", notificationsController.updateUserNotification);


module.exports = notificationsRouter;
