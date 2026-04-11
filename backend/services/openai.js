const Groq = require('groq-sdk')

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

async function callOpenAI(prompt, systemPrompt) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')

  console.log('Trying Groq...')
  console.log('Groq Key present:', !!process.env.GROQ_API_KEY)

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: systemPrompt || getDefaultSystemPrompt()
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 200,
    temperature: 0.2,
  })

  console.log('Groq success')
  return response.choices[0].message.content
}

function getDefaultSystemPrompt() {
  return `Tu ek Indian gaon ka kisan saathi hai.
SIRF SHUDDH HINDI mein jawab do — ek bhi English word nahi.
Maximum 2 chhoti sentences.
Bilkul simple bhasha — jaise gaon ke buzurg baat karte hain.
Seedha batao: kya karna hai aur kitna paisa lagega.
Koi introduction nahi, seedha jawab do.`
}

module.exports = { callOpenAI }