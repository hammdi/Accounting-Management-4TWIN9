const { body, validationResult } = require('express-validator');

exports.validateInvoice = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('clientName').notEmpty().withMessage('Client Name is required'),
    body('clientEmail').isEmail().withMessage('Valid client email is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    body('status').isIn(['Pending', 'Paid', 'Overdue']).withMessage('Invalid status'),
    body('dueDate').isISO8601().withMessage('Invalid date format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
