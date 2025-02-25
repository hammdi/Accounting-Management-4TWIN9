// routes/aiPredictionRoutes.js
const express = require('express');
const { createAIPrediction, getAIPredictions, getAIPrediction, updateAIPrediction, deleteAIPrediction } = require('../controller/aiPredictionController');
const { validateAIPrediction } = require('../middleware/aiPredictionValidator');

const router = express.Router();


router.post('/addaiprediction',validateAIPrediction, createAIPrediction);
router.get('/getallaipredictions', getAIPredictions);
router.get('/getaiprediction/:id', getAIPrediction);
router.put('/updateaiprediction/:id',validateAIPrediction, updateAIPrediction);
router.delete('/deleteaiprediction/:id', deleteAIPrediction);

module.exports = router;
