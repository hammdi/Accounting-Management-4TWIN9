const express = require('express');
const router = express.Router();
const CompteComptable = require('../models/CompteComptable');

// GET all comptes
router.get('/', async (req, res) => {
    try {
        const comptes = await CompteComptable.find();
        res.json(comptes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;