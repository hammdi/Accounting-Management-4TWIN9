// controllers/taxController.js
const Tax = require('../models/Tax Compliance');
const logger = require('../utils/logger'); // Winston logger

// Create a new tax record
exports.createTax = async (req, res) => {
    try {
        const tax = new Tax(req.body);
        await tax.save();

        logger.info(`Tax record created: ${tax._id}`);
        res.status(201).json(tax);
    } catch (error) {
        logger.error(`Error creating tax record: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Get all tax records
exports.getTaxes = async (req, res) => {
    try {
        const taxes = await Tax.find().populate('company filedBy');

        logger.info(`Fetched ${taxes.length} tax records`);
        res.json(taxes);
    } catch (error) {
        logger.error(`Error fetching tax records: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Get a single tax record
exports.getTax = async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id).populate('company filedBy');

        if (!tax) {
            logger.warn(`Tax record not found: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }

        logger.info(`Fetched tax record: ${tax._id}`);
        res.json(tax);
    } catch (error) {
        logger.error(`Error fetching tax record: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Update a tax record
exports.updateTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!tax) {
            logger.warn(`Tax record not found for update: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }

        logger.info(`Updated tax record: ${tax._id}`);
        res.json(tax);
    } catch (error) {
        logger.error(`Error updating tax record: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Delete a tax record
exports.deleteTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndDelete(req.params.id);

        if (!tax) {
            logger.warn(`Tax record not found for deletion: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }

        logger.info(`Deleted tax record: ${tax._id}`);
        res.json({ message: "Tax record deleted" });
    } catch (error) {
        logger.error(`Error deleting tax record: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

