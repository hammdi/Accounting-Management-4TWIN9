const express = require('express');
const router = express.Router();
const AccountingEntry = require('../models/AccountingEntry');
const CompteComptable = require('../models/CompteComptable');

router.get('/', async (req, res) => {
    try {
        const entries = await AccountingEntry.find().populate('invoice');

        // Enrich each line with Libelle
        for (const entry of entries) {
            for (const line of entry.entries) {
                const accountInfo = await CompteComptable.findOne({ Num: parseInt(line.account) });
                line.libelle = accountInfo?.Libelle || 'Compte inconnu';
            }
        }

        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
