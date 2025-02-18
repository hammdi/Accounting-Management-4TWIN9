const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

// Inscription de l'utilisateur
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Vérifier si l'email existe déjà
       /* const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }*/

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const user = new User({ name, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Connexion réussie',
            //token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
