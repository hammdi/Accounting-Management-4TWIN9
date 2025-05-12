const express = require("express");
const router = express.Router();
const Compte = require("../models/CompteComptable");

router.get("/", async (req, res) => {
    try {
        const comptes = await Compte.find();
        res.json(comptes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
