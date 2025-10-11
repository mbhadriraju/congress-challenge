const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const collection = require('../src/config')
const { authenticateToken } = require('../src/middleware/auth')

router.post('/', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword, email } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json({ status: 'error', message: 'Old password and new password required' })
    const user = await collection.findOne({ email })
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) return res.json({ status: 'error', message: 'Old password incorrect' })
    const hashed = await bcrypt.hash(newPassword, 10)
    if (oldPassword === newPassword) return res.json({ status: 'error', message: 'New password must be different from old password' })
    await collection.updateOne({ email }, { $set: { password: hashed } })
    return res.json({ status: 'success' })
})

module.exports = router