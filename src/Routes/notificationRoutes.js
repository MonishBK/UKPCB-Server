const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {upload} = require('../middlewares/uploadFiles')

const {addNotification, deleteNotificationFiles, deleteNotification, ViewSingleNotification, ViewNotifications} = require('../Controllers/NotificationControllers')


// Add Notification
router.post('/upload/e-files', upload.array("files", 10), Authenticate, addNotification);

// delete notification files
router.delete('/delete-notification-files', Authenticate, deleteNotificationFiles);

// delete notification
router.delete('/delete-notification', Authenticate, deleteNotification);

// fetch single notifications
router.get('/fetch-single-notification/:id', ViewSingleNotification);

// fetch notifications
router.get('/fetch-notifications', ViewNotifications);


module.exports = router;