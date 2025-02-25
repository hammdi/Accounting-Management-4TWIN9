const { body, validationResult } = require('express-validator');

exports.validatePayroll = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('employee').notEmpty().withMessage('Employee ID is required'),
    body('salary').isFloat({ gt: 0 }).withMessage('Salary must be greater than zero'),
    body('paymentDate').isISO8601().withMessage('Invalid date format'),
    body('status').isIn(['Pending', 'Paid']).withMessage('Invalid status'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
