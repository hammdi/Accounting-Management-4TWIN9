const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

// Send SMS with invoice details
router.post('/send', smsController.sendInvoiceSMS);

module.exports = router;
