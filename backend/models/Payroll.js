const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salary: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);