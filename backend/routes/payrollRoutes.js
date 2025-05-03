const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const payrollController = require('../controller/payrollController');

// All routes require authentication
router.use(auth);

// Routes
router.post('/addpayroll', payrollController.createPayroll);
router.get('/getallpayrolls', payrollController.getMyPayrolls);
router.get('/getpayroll/:id', payrollController.getPayroll);
router.put('/updatepayroll/:id', payrollController.updatePayroll);
router.delete('/deletepayroll/:id', payrollController.deletePayroll);

module.exports = router;