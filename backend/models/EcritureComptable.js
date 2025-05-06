const mongoose = require("mongoose");

const EcritureComptableSchema = new mongoose.Schema({
    dateEcriture: { type: Date, default: Date.now },
    description: { type: String, required: true },

    compteDebit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompteComptable',
        required: true
    },
    compteCredit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompteComptable',
        required: true
    },

    montant: { type: Number, required: true },
    reference: { type: String },
    journalCode: { type: String, default: 'OD' } // exemple : OD = opérations diverses
});

module.exports = mongoose.model("EcritureComptable", EcritureComptableSchema);
