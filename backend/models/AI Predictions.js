const mongoose = require('mongoose');

const AIPredictionSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    predictionType: { type: String, enum: ['Revenue Forecast', 'Expense Forecast', 'Compliance Risk'], required: true },
    details: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AIPrediction', AIPredictionSchema);
