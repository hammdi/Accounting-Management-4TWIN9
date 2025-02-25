const express = require('express');
const { createAIDataset, getAIDatasets } = require('../controller/aiDatasetController');
const { validateAIDataset } = require('../middleware/aiDatasetValidator');

const router = express.Router();

router.post('/addaidataset', validateAIDataset, createAIDataset);
router.get('/getalldatasets',  getAIDatasets);

module.exports = router;