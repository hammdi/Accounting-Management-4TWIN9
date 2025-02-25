// controllers/auditLogController.js
const AuditLog = require('../models/Audit Logs');

exports.createAuditLog = async (req, res) => {
    try {
        const log = new AuditLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('user');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
