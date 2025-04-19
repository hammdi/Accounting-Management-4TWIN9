const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sale_price: { type: Number, required: true },
    purchase_price: { type: Number, required: true },
    sale_account: { type: String, required: true },
    purchase_account: { type: String, required: true },
    vat_sale_account: { type: String, required: true },
    vat_purchase_account: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);
