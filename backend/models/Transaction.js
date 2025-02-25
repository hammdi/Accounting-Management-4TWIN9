const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
