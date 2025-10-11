const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const collection = require('../src/config');
const { authenticateToken } = require('../src/middleware/auth');

router.post('/delete', authenticateToken, async (req, res) => {
  try {
    const result = await collection.findByIdAndDelete(req.user.id);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    return res.json({ status: 'success', message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
  }
});

router.post('/change-email', authenticateToken, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    
    if (!newEmail || !password) {
      return res.status(400).json({ status: 'error', message: 'New email and current password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ status: 'error', message: 'Invalid email format' });
    }

    const user = await collection.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' });
    }

    const existingUser = await collection.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ status: 'error', message: 'Email already in use' });
    }

    const updatedUser = await collection.findByIdAndUpdate(
      req.user.id,
      { email: newEmail.toLowerCase() },
      { new: true }
    );

    return res.json({ 
      status: 'success', 
      message: 'Email updated successfully',
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    });
  } catch (error) {
    console.error('Change email error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: 'error', message: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ status: 'error', message: 'New password must be at least 8 characters long' });
    }

    const user = await collection.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await collection.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    return res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
  }
});

module.exports = router;