const CompteComptable = require('../models/CompteComptable');

const getAllComptes = async (req, res) => {
    try {
        const comptes = await CompteComptable.find();
        res.json(comptes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllComptes };
