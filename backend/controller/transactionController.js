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

        const { company: companyId, type, category, amount, date, description, merchantCategory, merchantCountry, paymentMethod } = req.body;
        
        // Validate required fields
        if (!companyId || !type || !category || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: 'Company, type, category, amount, and date are required'
            });
        }

        // Parse date
        let parsedDate;
        try {
            if (typeof date === 'string') {
                if (date.includes('T')) { // If it's already an ISO string
                    parsedDate = new Date(date);
                } else { // If it's just a date string (YYYY-MM-DD)
                    parsedDate = new Date(date + 'T00:00:00.000Z');
                }
            } else if (date instanceof Date) {
                parsedDate = date;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const transactionData = {
            company: companyId,
            type,
            category,
            amount,
            date: parsedDate,
            description,
            merchantCategory: merchantCategory || 'unknown',
            merchantCountry: merchantCountry || 'unknown',
            paymentMethod: paymentMethod || 'unknown',
            timestamp: parsedDate,
            createdBy: req.user._id
        };

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

// Get all transactions created by the connected user (no pagination/filter)
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ createdBy: req.user._id }).populate('company createdBy').sort({ date: -1 });
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Error fetching user transactions:', error);
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
        const { company: companyId, type, category, amount, date, description, merchantCategory, merchantCountry, paymentMethod } = req.body;
        
        // Validate required fields
        if (!companyId || !type || !category || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: 'Company, type, category, amount, and date are required'
            });
        }

        // Parse date
        let parsedDate;
        try {
            if (typeof date === 'string') {
                if (date.includes('T')) { // If it's already an ISO string
                    parsedDate = new Date(date);
                } else { // If it's just a date string (YYYY-MM-DD)
                    parsedDate = new Date(date + 'T00:00:00.000Z');
                }
            } else if (date instanceof Date) {
                parsedDate = date;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Update transaction fields
        transaction.company = companyId;
        transaction.type = type;
        transaction.category = category;
        transaction.amount = amount;
        transaction.date = parsedDate;
        transaction.description = description;
        transaction.merchantCategory = merchantCategory || 'unknown';
        transaction.merchantCountry = merchantCountry || 'unknown';
        transaction.paymentMethod = paymentMethod || 'unknown';
        transaction.timestamp = parsedDate;
        transaction.createdBy = req.user._id;

        await transaction.save();
        
        // Update company's transaction balance
        const oldCompany = await Company.findById(transaction.company);
        if (transaction.type === 'Income') {
            oldCompany.balance += transaction.amount;
        } else {
            oldCompany.balance -= transaction.amount;
        }
        await oldCompany.save();

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({
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
