const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    },
    merchantCategory: {
        type: String,
        default: 'unknown'
    },
    merchantCountry: {
        type: String,
        default: 'unknown'
    },
    paymentMethod: {
        type: String,
        default: 'unknown'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for total amount (for aggregation purposes)
TransactionSchema.virtual('totalAmount').get(function() {
    return this.amount;
});

module.exports = mongoose.model('Transaction', TransactionSchema);
