const mongoose = require('mongoose');

// Définir le schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true, // Ensure that phone numbers are unique
    },
    status: {
        type: String,
        enum: ['Inactive','Active'], // Enum restricts status to Active or Inactive only
        //default: 'Active', // Default to Active if no status is provided
    },
    verificationToken: { type: String, required: false }, // Token for email verification

    is_2fa_enabled: {type: Boolean, default: false},
    avatar: { 
        type: Buffer, // Stockage de l'image en binaire
        required: false 
    },
    nametest: {
        type: String,
    },
}, { timestamps: true });

// Créer le modèle à partir du schéma
module.exports = mongoose.model('User', userSchema);
