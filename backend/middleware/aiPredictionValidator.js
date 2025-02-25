const { body, validationResult } = require('express-validator');

exports.validateAIPrediction = [
    body('company').notEmpty().withMessage('Company ID is required'),
    body('predictionType').isIn(['Revenue Forecast', 'Expense Forecast', 'Compliance Risk']).withMessage('Invalid prediction type'),
    body('details').notEmpty().withMessage('Details are required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
