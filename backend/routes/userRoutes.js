const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser,getAllUsers,forgotPassword,updatePassword } = require('../controller/userController');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const User = require("../models/userModel");

// Route pour l'inscription
router.post('/register', registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour obtenir un utilisateur par ID (requiert une authentification)
router.get('/user/:id', authenticateJWT, getUser);

// Route pour mettre à jour un utilisateur (requiert une authentification)
router.put('/user/:id', authenticateJWT, updateUser);

// Route pour supprimer un utilisateur (requiert une authentification)
router.delete('/user/:id', authenticateJWT, deleteUser);
router.get('/users', authenticateJWT, getAllUsers);
router.get("/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Activate user
        user.status = 'Active';
        user.verificationToken = null; // Remove token after activation
        await user.save();
        return res.redirect("https://frontend2-l576.onrender.com/?accountActivated=true");

        //res.json({ message: "Account activated successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post("/forgot-password", forgotPassword);
router.put("/update-password", authenticateJWT,updatePassword);
module.exports = router;
