const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // For development, create a test user if none exists
            let testUser = await User.findOne({ email: 'test@example.com' });
            
            if (!testUser) {
                testUser = await User.create({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'user',
                    phone: '+1234567890',
                    status: 'Active'
                });
            }
            
            req.user = testUser;
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

module.exports = auth;
