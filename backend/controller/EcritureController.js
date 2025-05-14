const Ecriture = require("../models/EcritureComptable");
const Compte = require("../models/CompteComptable");

exports.creerEcriture = async (req, res) => {
    try {
        const { description, compteDebit, compteCredit, montant, reference, journalCode } = req.body;

        const ecriture = new Ecriture({
            description,
            compteDebit,
            compteCredit,
            montant,
            reference,
            journalCode
        });

        await ecriture.save();

        // Mettre à jour les soldes des comptes
        await Compte.findByIdAndUpdate(compteDebit, { $inc: { solde: montant } });
        await Compte.findByIdAndUpdate(compteCredit, { $inc: { solde: -montant } });

        res.status(201).json(ecriture);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listerEcritures = async (req, res) => {
    try {
        const ecritures = await Ecriture.find()
            .populate('compteDebit')
            .populate('compteCredit')
            .sort({ dateEcriture: -1 });

        res.status(200).json(ecritures);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
