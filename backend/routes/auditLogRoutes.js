const express = require('express');
const { createAuditLog, getAuditLogs} = require('../controller/auditLogController');
const { validateAuditLog } = require('../middleware/auditLogValidator');

const router = express.Router();

router.post('/addauditlog', validateAuditLog, createAuditLog);
router.get('/getallauditlogs',  getAuditLogs);

module.exports = router;