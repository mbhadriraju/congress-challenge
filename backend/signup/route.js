const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const collection = require('../src/config')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long' });
        }

        const existingUser = await collection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            benefits: []
        };

        const newUser = await collection.create(userData);
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign(
            { 
                userId: newUser._id,
                email: newUser.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token: token,
            user: {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                benefits: newUser.benefits
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
    }
});

module.exports = router; 