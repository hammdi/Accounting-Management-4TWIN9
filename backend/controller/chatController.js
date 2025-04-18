const Chat = require('../models/chat');
const User = require('../models/userModel');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const Company = require('../models/Company');

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Helper function to analyze transactions
const analyzeTransactions = async (userId) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const transactions = await Transaction.find({
        createdBy: userId,
        date: { $gte: thirtyDaysAgo }
    });

    const totalIncome = transactions
        .filter(t => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type.toLowerCase() === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions.length
    };
};

// Helper function to get pending invoices
const getPendingInvoices = async (userId) => {
    return await Invoice.find({
        issuedBy: userId,
        status: 'Pending'
    }).sort({ dueDate: 1 }).limit(5);
};

// Enhanced response generator with accounting context
// Enhanced response generator with accounting context and user personalization
const generateAccountingResponse = async (message, userId, user) => {
    const lowercaseMsg = message.toLowerCase();
    
    // Transaction Analysis
    if (lowercaseMsg.includes('transaction') || lowercaseMsg.includes('spending') || lowercaseMsg.includes('income')) {
        const analysis = await analyzeTransactions(userId);
        return `Here's your 30-day financial summary:
- Total Income: ${formatCurrency(analysis.totalIncome)}
- Total Expenses: ${formatCurrency(analysis.totalExpenses)}
- Net Income: ${formatCurrency(analysis.netIncome)}
- Number of Transactions: ${analysis.transactionCount}`;
    }

    // Invoice Management
    if (lowercaseMsg.includes('invoice') || lowercaseMsg.includes('bill')) {
        const pendingInvoices = await getPendingInvoices(userId);
        if (pendingInvoices.length === 0) {
            return "You have no pending invoices at the moment.";
        }
        return `You have ${pendingInvoices.length} pending invoice(s):
${pendingInvoices.map(inv => `- ${inv.invoiceNumber}: ${formatCurrency(inv.amount)} (due: ${inv.dueDate.toLocaleDateString()})`).join('\n')}`;
    }

    // Company Information
    if (lowercaseMsg.includes('company') || lowercaseMsg.includes('business')) {
        const company = await Company.findOne({ owner: userId });
        if (!company) {
            return "I don't have any company information on record. Would you like to add your company details?";
        }
        return `Company Information:
- Name: ${company.name}
- Registration: ${company.registrationNumber}
- Tax ID: ${company.taxId}
- Address: ${company.address}`;
    }

    // Help Commands
    if (lowercaseMsg.includes('help') || lowercaseMsg.includes('commands')) {
        return `I can help you with:
1. Transaction Analysis - View your income and spending
2. Invoice Management - Check pending invoices and bills
3. Company Information - Access your business details
4. Financial Reports - Generate various financial statements
5. Tax Information - Get tax-related assistance

Just ask me about any of these topics!`;
    }

    // Default response
    return "I'm your accounting assistant. I can help with transactions, invoices, company information, and financial analysis. Type 'help' to see what I can do!";
};

// Get chat history for the authenticated user
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10);

        res.json({
            success: true,
            history: chats
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat history'
        });
    }
};

// Process a new message for the authenticated user
exports.processMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;
        const user = req.user; // Full user object for personalization

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Generate response with user context
        const response = await generateAccountingResponse(message, userId, user);

        // Save the chat
        const newChat = new Chat({
            userId,
            messages: [
                { content: message, type: 'user', timestamp: new Date() },
                { content: response, type: 'bot', timestamp: new Date() }
            ],
            timestamp: new Date()
        });

        await newChat.save();

        res.json({
            success: true,
            reply: response
        });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process message'
        });
    }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id; 

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        await chat.remove();

        res.json({
            success: true,
            message: 'Chat deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete chat'
        });
    }
};
