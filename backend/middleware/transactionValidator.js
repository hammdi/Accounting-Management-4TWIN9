const { body, validationResult } = require('express-validator');

exports.validateTransaction = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('type').isIn(['Income', 'Expense']).withMessage('Invalid transaction type'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Invalid date format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
