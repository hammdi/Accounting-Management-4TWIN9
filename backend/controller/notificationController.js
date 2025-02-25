// controllers/notificationController.js
const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('user');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
