const express = require('express')
const mongoose = require('mongoose')
const { authenticateToken } = require('../src/middleware/auth')
const router = express.Router()

const QuestAnswerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    answers: { type: Object, required: true },
    submittedAt: { type: Date, default: Date.now },
})

const QuestAnswer = mongoose.models.questanswers || mongoose.model('questanswers', QuestAnswerSchema)

// Secure route with authenticateToken so req.user is populated
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ status: 'error', message: 'Answers are required.' })
        }
        // Save with userId from JWT (merge handled on index route too)
        const existing = await QuestAnswer.findOne({ userId: req.user.id });
        if (existing) {
          existing.answers = { ...(existing.answers || {}), ...answers };
          existing.submittedAt = new Date();
          await existing.save();
          return res.status(200).json({ status: 'success', message: 'Answers updated!' });
        }
        await QuestAnswer.create({ userId: req.user.id, answers });
        return res.status(200).json({ status: 'success', message: 'Answers submitted!' });
    } catch (e) {
        return res.status(500).json({ status: 'error', message: 'Failed to save answers.' });
    }
});

// Get current user's answers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const existing = await QuestAnswer.findOne({ userId: req.user.id })
    if (!existing) return res.status(404).json({ status: 'not found' })
    return res.json({ status: 'success', answers: existing.answers })
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve answers.' })
  }
});

module.exports = router; 