// routes/notificationRoutes.js
const express = require('express');
const { createNotification, getNotifications} = require('../controller/notificationController');
const { validateNotification } = require('../middleware/notificationValidator');

const router = express.Router();

router.post('/addnotification', validateNotification, createNotification);
router.get('/getallnotifications', getNotifications);

module.exports = router;