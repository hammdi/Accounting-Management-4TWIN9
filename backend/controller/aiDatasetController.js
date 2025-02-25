// controllers/aiDatasetController.js
const AIDataset = require('../models/AI Dataset');

exports.createAIDataset = async (req, res) => {
    try {
        const dataset = new AIDataset(req.body);
        await dataset.save();
        res.status(201).json(dataset);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAIDatasets = async (req, res) => {
    try {
        const datasets = await AIDataset.find().populate('company');
        res.json(datasets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
