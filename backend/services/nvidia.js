const axios = require('axios')

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY

async function callNvidia(prompt, systemPrompt) {
  if (!NVIDIA_API_KEY) throw new Error('NVIDIA_API_KEY not set')

  console.log('Trying NVIDIA...')
  console.log('NVIDIA Key present:', !!NVIDIA_API_KEY)
  console.log('NVIDIA Key starts with:', NVIDIA_API_KEY?.substring(0, 8))

  const response = await axios.post(
    `${NVIDIA_BASE_URL}/chat/completions`,
    {
      model: 'meta/llama-3.1-8b-instruct',
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
      stream: false,
    },
    {
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    }
  )

  console.log('NVIDIA success')
  return response.data.choices[0].message.content
}

function getDefaultSystemPrompt() {
  return `Tu ek Indian gaon ka kisan saathi hai.
SIRF SHUDDH HINDI mein jawab do — ek bhi English word nahi.
Maximum 2 chhoti sentences.
Bilkul simple bhasha — jaise gaon ke buzurg baat karte hain.
Seedha batao: kya karna hai aur kitna paisa lagega.
Koi introduction nahi, seedha jawab do.`
}

module.exports = { callNvidia }