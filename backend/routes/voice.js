const express = require('express')
const router = express.Router()
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')
const { getRuleEngineResponse } = require('../services/ruleEngine')

// POST /api/voice/process
router.post('/process', async (req, res, next) => {
  try {
    const { text, domain, crop, location, language } = req.body

    if (!text) {
      return res.status(400).json({ error: 'text is required' })
    }

    const lang = language || 'Hindi'
    const prompt = buildDomainPrompt(domain, text, crop, location, lang)

    let response = null
    let source = null

    try {
      response = await callNvidia(prompt)
      source = 'nvidia'
    } catch {
      try {
        response = await callOpenAI(prompt)
        source = 'groq'
      } catch {
        const ruleResult = getRuleEngineResponse(text)
        response = ruleResult.response
        source = 'rule_engine'
      }
    }

    return res.json({
      response,
      source,
      language: lang,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    next(err)
  }
})

function buildDomainPrompt(domain, text, crop, location, language) {
  const base = `Farmer said: "${text}"
Location: ${location || 'India'}
${crop ? `Crop: ${crop}` : ''}
Respond in simple ${language} in maximum 3 sentences.
Give ONE clear action with cost if applicable.`

  if (domain === 'crop') return `You are an agricultural advisor for Indian farmers. ${base}`
  if (domain === 'mandi') return `You are a mandi price advisor for Indian farmers. ${base} Tell where and when to sell.`
  if (domain === 'scheme') return `You are a government scheme advisor for Indian farmers. ${base} Mention which schemes apply.`
  return `You are a helpful assistant for Indian farmers. ${base}`
}

module.exports = router