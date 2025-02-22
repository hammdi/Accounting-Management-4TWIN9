const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Assure-toi d'avoir un modèle User
const authMiddleware = require('../middleware/authMiddleware'); // Middleware pour vérifier le token

// Route pour récupérer l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
    try {
        console.log("req.user:", req.user); // Affiche l'objet `req.user`
        console.log("req.user.id:", req.user.id); // Affiche `req.user.id`


        const user = await User.findById(req.user.userId).select('-password'); // Exclure le mot de passe
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;
