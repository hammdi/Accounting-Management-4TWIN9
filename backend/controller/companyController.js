// controllers/companyController.js
const Company = require('../models/Company');
const logger = require('../utils/logger'); // Optional: if you use logging

// Create a new company
exports.createCompany = async (req, res) => {
    try {
        const company = new Company({
            ...req.body,
            owner: req.user._id
        });
        await company.save();

        logger.info(`Company created: ${company._id}`);
        res.status(201).json(company);
    } catch (error) {
        logger.error(`Error creating company: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate('owner accountants');
        res.status(200).json(companies);
    } catch (error) {
        logger.error(`Error fetching companies: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Get companies owned by the connected user
exports.getUserCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ owner: req.user._id }).populate('owner accountants');
        res.status(200).json(companies);
    } catch (error) {
        logger.error(`Error fetching user companies: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Get a single company
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('owner accountants');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        logger.error(`Error fetching company: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Update a company
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        logger.info(`Company updated: ${company._id}`);
        res.status(200).json(company);
    } catch (error) {
        logger.error(`Error updating company: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        logger.info(`Company deleted: ${company._id}`);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting company: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
