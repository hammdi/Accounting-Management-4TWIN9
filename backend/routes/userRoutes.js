const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser,getAllUsers } = require('../controller/userController');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');

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

module.exports = router;
