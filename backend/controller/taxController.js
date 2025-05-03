const Tax = require('../models/Tax Compliance');
const logger = require('../utils/logger');

exports.createTax = async (req, res) => {
    try {
        const tax = new Tax({
            ...req.body,
            createdBy: req.user._id
        });
        await tax.save();
        logger.info(`Tax record created: ${tax._id}`);
        res.status(201).json(tax);
    } catch (error) {
        logger.error(`Error creating tax record: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getMyTaxCompliance = async (req, res) => {
    try {
        const taxes = await Tax.find({ createdBy: req.user._id })
            .populate('company')
            .sort({ dueDate: -1 });
        
        res.json(taxes);
    } catch (error) {
        console.error('Error fetching user tax records:', error);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getTax = async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id)
            .populate('company')
            .where('createdBy', req.user._id);
        
        if (!tax) {
            logger.warn(`Tax record not found or unauthorized access: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }
        
        logger.info(`Fetched tax record: ${tax._id}`);
        res.json(tax);
    } catch (error) {
        logger.error(`Error fetching tax record: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        )
        .where('createdBy', req.user._id);
        
        if (!tax) {
            logger.warn(`Tax record not found or unauthorized access for update: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }
        
        logger.info(`Updated tax record: ${tax._id}`);
        res.json(tax);
    } catch (error) {
        logger.error(`Error updating tax record: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndDelete(req.params.id)
            .where('createdBy', req.user._id);
        
        if (!tax) {
            logger.warn(`Tax record not found or unauthorized access for deletion: ${req.params.id}`);
            return res.status(404).json({ error: "Tax record not found" });
        }
        
        logger.info(`Deleted tax record: ${tax._id}`);
        res.json({ message: "Tax record deleted" });
    } catch (error) {
        logger.error(`Error deleting tax record: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};