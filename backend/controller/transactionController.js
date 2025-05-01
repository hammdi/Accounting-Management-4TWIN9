// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Company = require('../models/Company');
const User = require('../models/userModel');
const logger = require('../utils/logger'); // Winston logger

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const company = await Company.findById(req.body.company);
        if (!company) {
            logger.warn(`Company not found: ${req.body.company}`);
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            logger.warn(`User not found: ${req.user._id}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const transactionData = { ...req.body, createdBy: req.user._id };
        const transaction = new Transaction(transactionData);
        await transaction.save();

        if (transaction.type === 'Income') {
            company.balance += transaction.amount;
        } else {
            company.balance -= transaction.amount;
        }
        await company.save();

        logger.info(`Transaction created: ${transaction._id} by user ${req.user._id}`);

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        logger.error(`Error creating transaction: ${error.message}`);
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

        logger.info(`Fetched ${transactions.length} transactions for user ${req.user._id}`);

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
        logger.error(`Error fetching transactions: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all transactions created by the connected user (no pagination/filter)
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ createdBy: req.user._id }).populate('company createdBy').sort({ date: -1 });
        logger.info(`Fetched all user transactions for user ${req.user._id}`);
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        logger.error(`Error fetching user transactions: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('company createdBy');

        if (!transaction) {
            logger.warn(`Transaction not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        logger.info(`Fetched transaction ${transaction._id}`);
        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        logger.error(`Error fetching transaction: ${error.message}`);
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
            logger.warn(`Transaction not found for update: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const oldCompany = await Company.findById(transaction.company);
        if (transaction.type === 'Income') {
            oldCompany.balance -= transaction.amount;
        } else {
            oldCompany.balance += transaction.amount;
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        ).populate('company createdBy');

        const newCompany = await Company.findById(updatedTransaction.company);
        if (updatedTransaction.type === 'Income') {
            newCompany.balance += updatedTransaction.amount;
        } else {
            newCompany.balance -= updatedTransaction.amount;
        }

        await Promise.all([oldCompany.save(), newCompany.save()]);

        logger.info(`Updated transaction ${updatedTransaction._id}`);

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });
    } catch (error) {
        logger.error(`Error updating transaction: ${error.message}`);
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
            logger.warn(`Transaction not found for deletion: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const company = await Company.findById(transaction.company);
        if (transaction.type === 'Income') {
            company.balance -= transaction.amount;
        } else {
            company.balance += transaction.amount;
        }
        await company.save();

        await Transaction.findByIdAndDelete(req.params.id);

        logger.info(`Deleted transaction ${transaction._id}`);

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        logger.error(`Error deleting transaction: ${error.message}`);
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
        logger.warn('All transactions deleted (collection dropped)');
        res.json({
            success: true,
            message: 'Transaction collection dropped successfully'
        });
    } catch (error) {
        logger.error(`Error dropping transaction collection: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

