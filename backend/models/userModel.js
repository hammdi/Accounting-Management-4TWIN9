const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['BusinessOwner', 'Accountant', 'User'], required: true },
    phone: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Inactive', 'Active'], default: 'Inactive' },
    verificationToken: { type: String },
    is_2fa_enabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

