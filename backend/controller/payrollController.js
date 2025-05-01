// controllers/payrollController.js
const Payroll = require('../models/Payroll');
const logger = require('../utils/logger');

exports.createPayroll = async (req, res) => {
    try {
        const payroll = new Payroll(req.body);
        await payroll.save();
        logger.info(`Payroll created: ${payroll._id}`);
        res.status(201).json(payroll);
    } catch (error) {
        logger.error(`Error creating payroll: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('company employee');
        logger.info(`Fetched ${payrolls.length} payrolls`);
        res.json(payrolls);
    } catch (error) {
        logger.error(`Error fetching payrolls: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getPayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id).populate('company employee');
        if (!payroll) {
            logger.warn(`Payroll not found: ${req.params.id}`);
            return res.status(404).json({ error: "Payroll not found" });
        }
        logger.info(`Fetched payroll: ${payroll._id}`);
        res.json(payroll);
    } catch (error) {
        logger.error(`Error fetching payroll: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updatePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payroll) {
            logger.warn(`Payroll not found for update: ${req.params.id}`);
            return res.status(404).json({ error: "Payroll not found" });
        }
        logger.info(`Updated payroll: ${payroll._id}`);
        res.json(payroll);
    } catch (error) {
        logger.error(`Error updating payroll: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.deletePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(req.params.id);
        if (!payroll) {
            logger.warn(`Payroll not found for deletion: ${req.params.id}`);
            return res.status(404).json({ error: "Payroll not found" });
        }
        logger.info(`Deleted payroll: ${payroll._id}`);
        res.json({ message: "Payroll deleted" });
    } catch (error) {
        logger.error(`Error deleting payroll: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

