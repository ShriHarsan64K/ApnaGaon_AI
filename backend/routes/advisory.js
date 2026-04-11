const express = require('express')
const router = express.Router()
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')
const { getRuleEngineResponse } = require('../services/ruleEngine')
const { getWeather } = require('../services/imd')

// POST /api/advisory
router.post('/', async (req, res, next) => {
  try {
    const { prompt, crop, problem, location, weather, language } = req.body

    if (!prompt && !problem) {
      return res.status(400).json({ error: 'prompt or problem required' })
    }

    // Auto fetch weather if location given
    let weatherInfo = weather
    if (!weatherInfo && location) {
      try {
        const weatherData = await getWeather(location)
        weatherInfo = weatherData.cropAction
      } catch (e) {
        weatherInfo = 'Mausam ki jaankari uplabdh nahi'
      }
    }

    const fullPrompt = buildPrompt({ prompt, crop, problem, location, weather: weatherInfo })
    const systemPrompt = buildSystemPrompt()

    let response = null
    let source = null

    // Layer 1 — NVIDIA
    try {
      response = await callNvidia(fullPrompt, systemPrompt)
      source = 'nvidia'
    } catch (e) {
      console.log('NVIDIA failed:', e.message)
    }

    // Layer 2 — Groq
    if (!response) {
      try {
        response = await callOpenAI(fullPrompt, systemPrompt)
        source = 'groq'
      } catch (e) {
        console.log('Groq failed:', e.message)
      }
    }

    // Layer 3 — Rule Engine
    if (!response) {
      console.log('Using Rule Engine...')
      const ruleResult = getRuleEngineResponse(fullPrompt)
      response = ruleResult.response
      source = 'rule_engine'
    }

    return res.json({
      response,
      source,
      crop: crop || 'unknown',
      weatherInfo,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    next(err)
  }
})

// GET /api/advisory/weather?location=Wardha
router.get('/weather', async (req, res, next) => {
  try {
    const { location } = req.query
    if (!location) return res.status(400).json({ error: 'location required' })
    const weather = await getWeather(location)
    res.json(weather)
  } catch (err) {
    next(err)
  }
})

function buildPrompt({ prompt, crop, problem, location, weather }) {
  if (prompt) return prompt
  return `Kisan ki samasya:
- Fasal: ${crop || 'pata nahi'}
- Dikkat: ${problem || 'pata nahi'}
- Jagah: ${location || 'India'}
- Mausam: ${weather || 'pata nahi'}

Seedha batao kya karna hai aur kitna paisa lagega.`
}

function buildSystemPrompt() {
  return `Tu ek Indian gaon ka kisan saathi hai.
SIRF SHUDDH HINDI mein jawab do — ek bhi English word nahi.
Maximum 2 chhoti sentences.
Bilkul simple bhasha — jaise gaon ke buzurg baat karte hain.
Seedha batao: kya karna hai aur kitna paisa lagega.
Koi introduction nahi, seedha jawab do.`
}

module.exports = router