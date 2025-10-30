const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { authenticateToken } = require('../src/middleware/auth')
const { computeBenefits } = require('../src/services/benefits')
const appGuidance = require('../src/services/appGuidance')
const { generateChat, buildSystemPrompt } = require('../src/services/gemini')

const QuestAnswer = mongoose.models.questanswers || mongoose.model('questanswers', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  answers: { type: Object, required: true },
  submittedAt: { type: Date, default: Date.now },
}))

const ChatMessage = mongoose.models.chatmessages || mongoose.model('chatmessages', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  at: { type: Date, default: Date.now, index: true }
}))

router.get('/context', authenticateToken, async (req, res) => {
  try {
    const qa = await QuestAnswer.findOne({ userId: req.user.id })
    const answers = qa?.answers || {}
    const benefits = computeBenefits(answers)
    return res.json({ status: 'success', data: { answers, benefits, appGuidance } })
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'Failed to load context' })
  }
})

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.user.id }).sort({ at: 1 }).limit(100)
    return res.json({ status: 'success', data: history })
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'Failed to load history' })
  }
})

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Message is required' })
    }
    const systemPrompt = buildSystemPrompt()
    const qa = await QuestAnswer.findOne({ userId: req.user.id })
    const answers = qa?.answers || {}
    const benefits = computeBenefits(answers)
    const appContext = { answers, benefits, appGuidance }

    const recent = await ChatMessage.find({ userId: req.user.id }).sort({ at: 1 }).limit(50)
    const messages = [
      { role: "system", content: systemPrompt },
      ...recent.map(m => ({ role: m.role, content: m.content }))
    ]
    messages.push({ role: 'user', content: message })
    const result = await generateChat({ messages, context: appContext })

    await ChatMessage.create({ userId: req.user.id, role: 'user', content: message })
    await ChatMessage.create({ userId: req.user.id, role: 'assistant', content: result })

    return res.json({ status: 'success', message: result })
  } catch (e) {
    return res.status(500).json({ status: 'error', message: e })
  }
})

module.exports = router
