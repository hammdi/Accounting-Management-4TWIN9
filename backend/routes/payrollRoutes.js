// routes/payrollRoutes.js
const express = require('express');
const { createPayroll, getPayrolls, getPayroll, updatePayroll, deletePayroll } = require('../controller/payrollController');
const { validatePayroll } = require('../middleware/payrollValidator');

const router = express.Router();


router.post('/addpayroll',validatePayroll, createPayroll);
router.get('/getallpayrolls', getPayrolls);
router.get('/getpayroll/:id', getPayroll);
router.put('/updatepayroll/:id',validatePayroll, updatePayroll);
router.delete('/deletepayroll/:id', deletePayroll);

module.exports = router;
