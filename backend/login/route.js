const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const collection = require('../src/config')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });
        }

        const user = await collection.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
            status: 'success',
            token: token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                benefits: user.benefits || []
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
    }
});

module.exports = router; 