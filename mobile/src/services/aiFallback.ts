import axios from 'axios'
import { API } from '../constants/api'

export async function getAIResponse(prompt: string): Promise<string> {
  // Layer 1 — Backend (NVIDIA → OpenAI)
  try {
    const res = await axios.post(
      `${API.BASE_URL}${API.ENDPOINTS.ADVISORY}`,
      { prompt },
      { timeout: 8000 }
    )
    if (res.data?.response) return res.data.response
  } catch (e) {
    console.log('Backend failed, using rule engine')
  }

  // Layer 2 — Rule Engine fallback
  return getRuleEngineResponse(prompt)
}

function getRuleEngineResponse(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (lower.includes('peele') || lower.includes('yellow')) {
    return 'Patte peele ho rahe hain to nitrogen ki kami ho sakti hai. Urea spray karo — 2% concentration. Kharcha lagbhag ₹80 per acre.'
  }
  if (lower.includes('keede') || lower.includes('pest')) {
    return 'Keede se bachne ke liye Chlorpyrifos spray karo. 2ml per litre paani. Subah ya shaam ko spray karo.'
  }
  if (lower.includes('sukha') || lower.includes('dry')) {
    return 'Fasal sukh rahi hai to turant sinchai karo. Drip irrigation use karo — paani bachega aur fasal bhi.'
  }
  return 'Apne nazdiki Krishi Vigyan Kendra mein jaayein ya Kisan Call Centre pe call karein: 1800-180-1551'
}