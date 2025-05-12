const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,
        enum: ['Admin', 'Accountant', 'Manager', 'Employee','user'],
        default: 'Employee'
    },
    phone: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^(\+\d{1,3})?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Suspended'], 
        default: 'Active'
    },
    verificationToken: { type: String },
    is_2fa_enabled: { type: Boolean, default: false },
    avatar: { 
        type: Buffer, 
        required: false 
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    department: {
        type: String,
        enum: ['Accounting', 'Finance', 'HR', 'IT', 'Management'],
        default: 'Accounting'
    },
    position: String,
    hireDate: { type: Date },
    lastLogin: { type: Date },
    permissions: {
        canViewReports: { type: Boolean, default: false },
        canManageUsers: { type: Boolean, default: false },
        canManageTransactions: { type: Boolean, default: false },
        canManageInvoices: { type: Boolean, default: false },
        canManageSettings: { type: Boolean, default: false }
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true }
    },
    settings: {
        theme: { 
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'light'
        },
        language: { 
            type: String,
            enum: ['en', 'fr', 'ar'],
            default: 'en'
        },
        dateFormat: { 
            type: String,
            enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
            default: 'DD/MM/YYYY'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);