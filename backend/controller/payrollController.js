// controllers/payrollController.js
const Payroll = require('../models/Payroll');

exports.createPayroll = async (req, res) => {
    try {
        const payroll = new Payroll(req.body);
        await payroll.save();
        res.status(201).json(payroll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('company employee');
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id).populate('company employee');
        if (!payroll) return res.status(404).json({ error: "Payroll not found" });
        res.json(payroll);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payroll) return res.status(404).json({ error: "Payroll not found" });
        res.json(payroll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(req.params.id);
        if (!payroll) return res.status(404).json({ error: "Payroll not found" });
        res.json({ message: "Payroll deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};