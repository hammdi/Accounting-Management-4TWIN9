// backend/models/BilanComptable.js
const mongoose = require('mongoose');

const BilanComptableSchema = new mongoose.Schema({
    dateBilan: { type: Date, required: true },
    actifNonCourant: { type: Number, default: 0 },
    actifCourant: { type: Number, default: 0 },
    totalActif: { type: Number, default: 0 },
    passifCourant: { type: Number, default: 0 },
    passifNonCourant: { type: Number, default: 0 },
    capitauxPropres: { type: Number, default: 0 },
    totalPassif: { type: Number, default: 0 },
    resultatExercice: { type: Number, default: 0 },
    devise: { type: String, default: 'TND' },
    periode: { type: String, required: true },
    entrepriseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
    isValidated: { type: Boolean, default: false },
    status: { type: String, enum: ['brouillon', 'en attente', 'validé', 'rejeté'], default: 'brouillon' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BilanComptable', BilanComptableSchema);
