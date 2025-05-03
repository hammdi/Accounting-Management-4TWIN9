const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taxController = require('../controller/taxController');

// All routes require authentication
router.use(auth);

// Routes
router.post('/addtax', taxController.createTax);
router.get('/getalltaxes', taxController.getMyTaxCompliance);
router.get('/gettax/:id', taxController.getTax);
router.put('/updatetax/:id', taxController.updateTax);
router.delete('/deletetax/:id', taxController.deleteTax);

module.exports = router;