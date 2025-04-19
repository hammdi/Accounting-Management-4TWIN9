const Invoice = require('../models/Invoice');

// @desc Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();

        const entries = [];

        for (const item of invoice.items) {
            const product = await Product.findOne({ name: item.name });
            if (!product) {
                return res.status(400).json({ error: `Produit introuvable: ${item.name}` });
            }

            const subtotal = item.quantity * item.unitPrice;
            const vatAmount = subtotal * (item.taxRate / 100); // ✅ now correctly defined

            entries.push(
                { account: '355', amount: subtotal, type: 'credit' },        // Produits finis
                { account: '43651', amount: vatAmount, type: 'credit' },     // TVA à payer
                { account: '411', amount: subtotal + vatAmount, type: 'debit' } // Client
            );
        }

        await AccountingEntry.create({
            invoice: invoice._id,
            entries,
        });

        res.status(201).json({
            message: '✅ Invoice and accounting entries created (strict plan comptable)',
            invoice,
        });

    } catch (error) {
        console.error("❌ Error during invoice creation:", error);
        res.status(400).json({ error: error.message });
    }
};

// @desc Get all invoices
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ issuedBy: req.user._id }).populate('company issuedBy');
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
