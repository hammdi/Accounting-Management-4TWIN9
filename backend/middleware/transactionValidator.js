const { body, validationResult } = require('express-validator');

exports.validateTransaction = [
    body('company')
        .notEmpty().withMessage('Company ID is required')
        .isMongoId().withMessage('Invalid company ID format'),
    
    body('type')
        .isIn(['Income', 'Expense']).withMessage('Invalid transaction type')
        .trim(),
    
    body('amount')
        .isFloat({ gt: 0 }).withMessage('Amount must be greater than zero')
        .custom(val => {
            const amount = parseFloat(val);
            if (amount < 0.01) {
                throw new Error('Amount must be at least 0.01');
            }
            return true;
        }),
    
    body('category')
        .notEmpty().withMessage('Category is required')
        .trim()
        .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
    
    body('date')
        .isISO8601().withMessage('Invalid date format')
        .toDate()
        .custom((value, { req }) => {
            if (value > new Date()) {
                throw new Error('Date cannot be in the future');
            }
            return true;
        }),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    
    body('createdBy')
        .notEmpty().withMessage('Created by user ID is required')
        .isMongoId().withMessage('Invalid user ID format'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg
                }))
            });
        }
        next();
    }
];
