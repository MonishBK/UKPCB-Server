const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {upload, uploadFiles} = require('../Components/uploadFiles')

const {addNotification, deleteNotificationFiles, deleteNotification, ViewNotifications} = require('../Controllers/NotificationControllers')


// Add Notification
router.post('/upload/e-files', upload.array("files", 10), Authenticate, addNotification);

// delete notification files
router.delete('/delete-notification-files', Authenticate, deleteNotificationFiles);

// delete notification
router.delete('/delete-notification', Authenticate, deleteNotification);

// fetch notifications
router.get('/fetch-notifications', ViewNotifications);


module.exports = router;