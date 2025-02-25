const { body, validationResult } = require('express-validator');

exports.validateAuditLog = [
    body('action').notEmpty().withMessage('Action is required'),
    body('user').notEmpty().withMessage('User ID is required'),
    body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];