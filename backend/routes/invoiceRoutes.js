const express = require('express');
const { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require('../controller/invoiceController');
const { validateInvoice } = require('../middleware/invoiceValidator');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/addinvoice', auth, validateInvoice, createInvoice);
router.get('/getallinvoice', auth, getInvoices);
router.get('/getinvoice/:id', auth, getInvoiceById);
router.put('/updateinvoice/:id', auth, validateInvoice, updateInvoice);
router.delete('/deleteinvoice/:id', auth, deleteInvoice);

module.exports = router;
