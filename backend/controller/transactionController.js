// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Company = require('../models/Company');
const User = require('../models/userModel');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        // Validate company exists
        const company = await Company.findById(req.body.company);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Use authenticated user for createdBy
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const transactionData = { ...req.body, createdBy: req.user._id };
        const transaction = new Transaction(transactionData);
        await transaction.save();

        // Update company's transaction balance
        if (transaction.type === 'Income') {
            company.balance += transaction.amount;
        } else {
            company.balance -= transaction.amount;
        }
        await company.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const { company, type, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        const query = { createdBy: req.user._id };
        if (company) query.company = company;
        if (type) query.type = type;
        if (startDate) query.date = { $gte: new Date(startDate) };
        if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };

        const transactions = await Transaction.find(query)
            .populate('company createdBy')
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('company createdBy');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Update company balance if transaction type changes
        const oldCompany = await Company.findById(transaction.company);
        if (transaction.type === 'Income') {
            oldCompany.balance -= transaction.amount;
        } else {
            oldCompany.balance += transaction.amount;
        }

        // Update with new values
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        ).populate('company createdBy');

        // Update new company balance
        const newCompany = await Company.findById(updatedTransaction.company);
        if (updatedTransaction.type === 'Income') {
            newCompany.balance += updatedTransaction.amount;
        } else {
            newCompany.balance -= updatedTransaction.amount;
        }

        await Promise.all([oldCompany.save(), newCompany.save()]);

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Update company balance
        const company = await Company.findById(transaction.company);
        if (transaction.type === 'Income') {
            company.balance -= transaction.amount;
        } else {
            company.balance += transaction.amount;
        }
        await company.save();

        await Transaction.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete all transactions (for testing purposes)
exports.deleteAllTransactions = async (req, res) => {
    try {
        await Transaction.collection.drop();
        res.json({
            success: true,
            message: 'Transaction collection dropped successfully'
        });
    } catch (error) {
        console.error('Error dropping transaction collection:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
