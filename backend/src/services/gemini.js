const { GoogleGenerativeAI } = require('@google/generative-ai')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro'

let genAI
let model

function getModel() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
  }
  return model
}

function buildSystemPrompt() {
  return (
    'You are the Benefits Assistant for this app. '
    + 'Use ONLY the provided user context (questionnaire answers, computed benefits) and app guidance. '
    + 'Goals: 1) Explain eligibility and next steps, 2) Help navigate the app screens/sections, 3) Provide clear, actionable steps. '
    + 'Constraints: You cannot fill forms or submit applications on the user\'s behalf. If asked, refuse politely and explain how the user can do it. '
    + 'If information is missing, ask concise clarifying questions. Cite question numbers (Q#) or sections when relevant. '
  )
}

async function generateChat({ messages, context }) {
  const model = getModel()

  // Build contents for Gemini
  const system = buildSystemPrompt()
  const preface = `\n[USER CONTEXT]\n${JSON.stringify(context)}\n[END CONTEXT]\n`
  const contents = [
    { role: 'user', parts: [{ text: system }] },
    { role: 'user', parts: [{ text: preface }] },
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }]})),
  ]
  const result = await model.generateContent({ contents })
  const text = result?.response?.text?.() || ''
  return { text }
}

module.exports = { getModel, buildSystemPrompt, generateChat }
