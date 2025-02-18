const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/userModel');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use(cors());

// Connexion à MongoDB

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Connexion à MongoDB réussie"))
    .catch(err => console.error("❌ Erreur de connexion à MongoDB:", err));
mongoose.connection.once("open", () => {
    console.log("✅ Connexion à MongoDB réussie depuis le conteneur !");
});
mongoose.connection.on("error", (err) => {
    console.error("❌ Erreur de connexion à MongoDB:", err);
});

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Backend Node.js fonctionne !');
});
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send('Utilisateur créé avec succès');
    }catch (e) {
        res.status(500).send(e.message);
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});

module.exports = app;
