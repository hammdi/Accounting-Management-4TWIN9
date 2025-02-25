const Invoice = require('../models/Invoice');

// @desc Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc Get all invoices
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('company issuedBy');
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Get invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('company issuedBy');
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Update invoice
exports.updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json({ message: 'Invoice updated successfully', updatedInvoice });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
