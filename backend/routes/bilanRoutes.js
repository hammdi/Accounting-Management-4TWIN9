const express = require('express');
const router = express.Router();
const bilanController = require('../controller/BilanController');

router.post('/', bilanController.createBilan);
router.get('/', bilanController.getBilans);
router.get('/:id/pdf', bilanController.exportPDF);

module.exports = router;
