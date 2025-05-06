const Bilan = require('../models/BilanComptable');

exports.createBilan = async (req, res) => {
    try {
        const bilan = new Bilan(req.body);
        const saved = await bilan.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBilans = async (req, res) => {
    try {
        const bilans = await Bilan.find().populate('entrepriseId');
        res.status(200).json(bilans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//PDF


const generateBilanPDF = require('../utils/pdfGenerator');
const path = require('path');

exports.exportPDF = async (req, res) => {
    const bilan = await Bilan.findById(req.params.id);
    const filePath = path.join(__dirname, `../exports/bilan-${bilan._id}.pdf`);

    await generateBilanPDF(bilan, filePath);
    res.download(filePath);
};