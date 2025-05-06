const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const logger = require('./utils/logger');
const compteComptableRoutes = require('./routes/compteComptableRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI environment variable is not defined.");
    process.exit(1);
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ['https://accounting-management-4twin9-production.up.railway.app'],
    credentials: true
}));

// Global request logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Import routes
const chatRoutes = require('./routes/chat');
const invoiceRoutes = require('./routes/invoiceRoutes');
const smsRoutes = require('./routes/smsRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/invoices', invoiceRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/payrolls', require('./routes/payrollRoutes'));
app.use('/api/taxes', require('./routes/taxRoutes'));
app.use('/api/aipredictons', require('./routes/aiPredictionRoutes'));
app.use('/api/aidatasets', require('./routes/aiDatasetRoutes'));
app.use('/api/auditlogs', require('./routes/auditLogRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ecritures', require('./routes/ecritureRoutes'));
app.use('/api/comptes', compteComptableRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/accounting-entries', require('./routes/accountingEntryRoutes'));

// AI Agent route (secured)
const auth = require('./middleware/auth');
app.use('/api/ai-agent', auth, require('./routes/aiAgent'));

// Bilan
const bilanRoute = require('./routes/bilanRoutes');
app.use('/api/bilans', bilanRoute);

// MongoDB connection
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        // Load models after successful MongoDB connection
        require('./models/chat');
        require('./models/userModel');
        require('./models/Company');
        require('./models/Invoice');
        require('./models/Transaction');
        require('./models/Payroll');
        require('./models/Tax Compliance');
        require('./models/AI Predictions');
        require('./models/AI Dataset');
        require('./models/Audit Logs');
        require('./models/Notification');
        require('./models/CompteComptable');
        require('./models/Product');
        require('./models/AccountingEntry');
        require('./routes/projectRoutes');
        require('./routes/taskRoutes');
        require('./models/BilanComptable');
        require('./models/EcritureComptable');

        console.log("📌 Models registered:", mongoose.modelNames());

        // Start server after successful MongoDB connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Resource not found'
    });
});

module.exports = app;