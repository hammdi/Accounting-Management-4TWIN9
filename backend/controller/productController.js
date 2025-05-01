const Product = require('../models/Product');
const logger = require('../utils/logger'); // Assure-toi que le logger est bien configuré ici

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        logger.info(`✅ Produit créé : ${product._id} par utilisateur ${req.user?._id || 'inconnu'}`);
        res.status(201).json({ message: '✅ Produit créé', product });
    } catch (err) {
        logger.error(`❌ Erreur lors de la création du produit : ${err.message}`);
        res.status(400).json({ error: err.message });
    }
};

