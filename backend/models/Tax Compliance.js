const mongoose = require('mongoose');

const TaxSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    taxYear: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Filed'], default: 'Pending' },
    filedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Tax', TaxSchema);