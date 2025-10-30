const { GoogleGenerativeAI } = require('@google/generative-ai')
const OpenAI = require("openai")

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY
});

function buildSystemPrompt() {
  return (
    'You are the Benefits Assistant for this app. '
    + 'Use ONLY the provided user context (questionnaire answers, computed benefits) and app guidance. '
    + 'Goals: 1) Explain eligibility and next steps, 2) Help navigate the app screens/sections, 3) Provide clear, actionable steps. '
    + 'Constraints: You cannot fill forms or submit applications on the user\'s behalf. If asked, refuse politely and explain how the user can do it. '
    + 'If information is missing, ask concise clarifying questions. Cite question numbers (Q#) or sections when relevant. '
    + 'Make your responses very brief, they should be short unless the user specifies they want them to be long'
  )
}

async function generateChat({ messages, context }) {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5-nano",
      messages: messages,
    });
    returnMessage = completion.choices[0].message.content;
    return returnMessage;
  } catch (error) {
    console.error(error)
  }  
}

module.exports = { generateChat, buildSystemPrompt }
