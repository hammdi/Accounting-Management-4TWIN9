const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: '✅ Produit créé', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
