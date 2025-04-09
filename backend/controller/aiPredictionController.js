// controllers/aiPredictionController.js
const AIPrediction = require('../models/AI Predictions');

exports.createAIPrediction = async (req, res) => {
    try {
        const prediction = new AIPrediction(req.body);
        await prediction.save();
        res.status(201).json(prediction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAIPredictions = async (req, res) => {
    try {
        const predictions = await AIPrediction.find().populate('company');
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAIPrediction = async (req, res) => {
    try {
        const prediction = await AIPrediction.findById(req.params.id).populate('company');
        if (!prediction) return res.status(404).json({ error: "AI Prediction not found" });
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAIPrediction = async (req, res) => {
    try {
        const prediction = await AIPrediction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!prediction) return res.status(404).json({ error: "AI Prediction not found" });
        res.json(prediction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteAIPrediction = async (req, res) => {
    try {
        const prediction = await AIPrediction.findByIdAndDelete(req.params.id);
        if (!prediction) return res.status(404).json({ error: "AI Prediction not found" });
        res.json({ message: "AI Prediction deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
