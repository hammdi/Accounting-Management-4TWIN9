// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const logger = require('../utils/logger');

exports.createInvoice = async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();

        logger.info(`Invoice created: ${invoice._id}`);
        res.status(201).json({
            message: 'Invoice created successfully',
            invoice,
        });
    } catch (error) {
        logger.error(`Error during invoice creation: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('company issuedBy');
        logger.info(`Fetched ${invoices.length} invoices`);
        res.status(200).json(invoices);
    } catch (error) {
        logger.error(`Error fetching invoices: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ issuedBy: req.user._id }).populate('company issuedBy');
        logger.info(`Fetched ${invoices.length} invoices for user ${req.user._id}`);
        res.status(200).json(invoices);
    } catch (error) {
        logger.error(`Error fetching user invoices: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('company issuedBy');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        if (invoice.issuedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        logger.error(`Error fetching invoice by ID: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        logger.info(`Invoice updated: ${updatedInvoice._id}`);
        res.status(200).json({ message: 'Invoice updated successfully', updatedInvoice });
    } catch (error) {
        logger.error(`Error updating invoice: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        logger.info(`Invoice deleted: ${deletedInvoice._id}`);
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting invoice: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

