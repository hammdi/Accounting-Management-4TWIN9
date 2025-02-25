// controllers/taxController.js
const Tax = require('../models/Tax Compliance');

exports.createTax = async (req, res) => {
    try {
        const tax = new Tax(req.body);
        await tax.save();
        res.status(201).json(tax);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTaxes = async (req, res) => {
    try {
        const taxes = await Tax.find().populate('company filedBy');
        res.json(taxes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTax = async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id).populate('company filedBy');
        if (!tax) return res.status(404).json({ error: "Tax record not found" });
        res.json(tax);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tax) return res.status(404).json({ error: "Tax record not found" });
        res.json(tax);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndDelete(req.params.id);
        if (!tax) return res.status(404).json({ error: "Tax record not found" });
        res.json({ message: "Tax record deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
