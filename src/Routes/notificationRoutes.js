const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {upload} = require('../middlewares/uploadFiles')

const {addNotification, deleteNotification, ViewNotification, ViewNotifications} = require('../Controllers/NotificationControllers')


// Add Notification
router.post('/upload/e-files', upload.single("file"), Authenticate, addNotification);

// delete notification
router.delete('/delete-notification', Authenticate, deleteNotification);

// fetch single notifications
router.get('/fetch-single-notification/:id', ViewNotification);

// fetch notifications
router.get('/fetch-notifications', ViewNotifications);


module.exports = router;