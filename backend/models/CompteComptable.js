const mongoose = require("mongoose");

const CompteComptableSchema = new mongoose.Schema({
    numero: String,
    libelle: String,
    niveau: Number,
    solde: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("CompteComptable", CompteComptableSchema);
