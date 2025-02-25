const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Vérifier si la variable d'environnement MONGO_URI est bien définie
if (!process.env.MONGO_URI) {
    console.error("❌ ERREUR : La variable d'environnement MONGO_URI n'est pas définie.");
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connexion à MongoDB réussie");

        // Charger les modèles après la connexion
        require('./models/userModel');          // User should be loaded first (referenced by many models)
        require('./models/Company');            // Company depends on User
        require('./models/Invoice');            // Invoice depends on Company and User
        require('./models/Transaction');        // Transactions depend on Invoice & Company
        require('./models/Payroll');            // Expense depends on Company
        require('./models/Tax Compliance');     // Tax depends on Company & User (filedBy)
        require('./models/AI Predictions');       // AI Prediction depends on Company
        require('./models/AI Dataset');          // AI Dataset depends on Company
        require('./models/Audit Logs');           // Audit Log depends on User
        require('./models/Notification');       // Notification depends on User

        // Vérifier les modèles enregistrés
        console.log("📌 Modèles enregistrés :", mongoose.modelNames());

        // Démarrer le serveur après la connexion MongoDB réussie
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Erreur de connexion à MongoDB:", err);
        process.exit(1); // Arrêter l'application en cas d'erreur critique
    });

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/payrolls', require('./routes/payrollRoutes'));
app.use('/api/taxes', require('./routes/taxRoutes'));
app.use('/api/aipredictons', require('./routes/aiPredictionRoutes'));
app.use('/api/aidatasets', require('./routes/aiDatasetRoutes'));
app.use('/api/auditlogs', require('./routes/auditLogRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Route principale
app.get('/', (req, res) => {
    res.send('🚀 Backend Node.js fonctionne !');
});

// Gestion globale des erreurs non gérées
process.on('unhandledRejection', (err) => {
    console.error("❌ Erreur non gérée :", err);
    process.exit(1);
});

module.exports = app;
