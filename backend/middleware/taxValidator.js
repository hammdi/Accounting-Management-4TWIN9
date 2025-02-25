const { body, validationResult } = require('express-validator');

exports.validateTax = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('taxYear').isInt({ min: 1900 }).withMessage('Invalid tax year'),
    body('taxAmount').isFloat({ gt: 0 }).withMessage('Tax amount must be greater than zero'),
    body('status').isIn(['Pending', 'Filed']).withMessage('Invalid status'),
    body('dueDate').isISO8601().withMessage('Invalid date format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
