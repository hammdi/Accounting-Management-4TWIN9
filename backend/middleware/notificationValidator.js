const { body, validationResult } = require('express-validator');

exports.validateNotification = [
    body('user').notEmpty().withMessage('User ID is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').isIn(['Invoice', 'Tax', 'AI Insight', 'General']).withMessage('Invalid notification type'),
    body('isRead').optional().isBoolean().withMessage('isRead must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];