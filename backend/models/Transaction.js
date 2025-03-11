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
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    description: {
        type: String,
        trim: true
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
