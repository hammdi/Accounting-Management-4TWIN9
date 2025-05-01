// controllers/notificationController.js
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        logger.info(`Notification created: ${notification._id}`);
        res.status(201).json(notification);
    } catch (error) {
        logger.error(`Error creating notification: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('user');
        logger.info(`Fetched ${notifications.length} notifications`);
        res.json(notifications);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
