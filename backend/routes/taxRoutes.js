// routes/taxRoutes.js
const express = require('express');
const { createTax, getTaxes, getTax, updateTax, deleteTax } = require('../controller/taxController');
const { validateTax } = require('../middleware/taxValidator');

const router = express.Router();


router.post('/addtax', validateTax, createTax);
router.get('/getalltaxes', getTaxes);
router.get('/gettax/:id', getTax);
router.put('/updatetax/:id', validateTax, updateTax);
router.delete('/deletetax/:id', deleteTax);

module.exports = router;