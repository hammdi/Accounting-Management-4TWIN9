const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    user: {type: String, required: false},
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
