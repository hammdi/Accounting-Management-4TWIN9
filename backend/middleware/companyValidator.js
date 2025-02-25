const { body, validationResult } = require('express-validator');

exports.validateCompany = [
    body('name').notEmpty().withMessage('Company name is required'),
    body('owner').notEmpty().withMessage('Owner ID is required'),
    body('taxNumber').notEmpty().withMessage('Tax Number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('status').isIn(['Active', 'Inactive']).withMessage('Invalid status'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
