const mongoose = require('mongoose');

const CompteComptableSchema = new mongoose.Schema({
    Num: { type: Number },
    Libelle: { type: String },
    Level: { type: Number }
});

const CompteComptable = mongoose.model("CompteComptable", CompteComptableSchema);
module.exports = CompteComptable;
