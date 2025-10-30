const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../src/middleware/auth')
const mongoose = require('mongoose')
const benefitsService = require('../src/services/benefits')

// Reuse existing model if already compiled to avoid OverwriteModelError
const QuestAnswer = mongoose.models.questanswers || mongoose.model('questanswers', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    answers: { type: Object, required: true },
    submittedAt: { type: Date, default: Date.now },
}))

router.get("/api", authenticateToken, async (req, res) => {
  try {
    const existing = await QuestAnswer.findOne({ userId: req.user.id })
    const answers = existing?.answers || {}

    const qualified = benefitsService.computeBenefits(answers)

    if (String(req.query.all).toLowerCase() === 'true') {
      const qualifiedIds = new Set(qualified.map(b => b.id))
      const data = benefitsService.ALL_BENEFITS.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        qualify: qualifiedIds.has(b.id),
        reason: qualified.find(q => q.id === b.id)?.reason || ''
      }))
      return res.status(200).json({ status: 'success', data })
    }

    const enriched = qualified.map(q => ({ ...q, description: q.description || benefitsService.ALL_BENEFITS.find(b=>b.id===q.id)?.description }))
    return res.status(200).json({ status: 'success', data: enriched })
  } catch (error) {
    return res.status(400).json({ status: 'error', message: `Error computing benefits: ${error}` })
  }
})

module.exports = router 