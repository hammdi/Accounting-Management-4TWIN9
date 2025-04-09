const { body, validationResult } = require('express-validator');

exports.validateAIDataset = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('dataType').isIn(['Transaction', 'Tax Compliance', 'Payroll']).withMessage('Invalid data type'),
    body('data').notEmpty().withMessage('Data is required'),
    body('processed').optional().isBoolean().withMessage('Processed must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];