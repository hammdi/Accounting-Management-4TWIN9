const express = require('express');
const { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require('../controller/invoiceController');
const { validateInvoice } = require('../middleware/invoiceValidator');

const router = express.Router();

router.post('/addinvoice', validateInvoice, createInvoice);
router.get('/getallinvoice', getInvoices);
router.get('/getinvoice/:id', getInvoiceById);
router.put('/updateinvoice/:id', validateInvoice, updateInvoice);
router.delete('/deleteinvoice/:id', deleteInvoice);

module.exports = router;
