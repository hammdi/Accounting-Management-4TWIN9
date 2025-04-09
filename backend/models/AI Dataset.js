const mongoose = require('mongoose');

const AIDatasetSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    dataType: { type: String, enum: ['Transaction', 'Tax Compliance', 'Payroll'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    processed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AIDataset', AIDatasetSchema);
