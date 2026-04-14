const express = require('express')
const router = express.Router()
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')
const { getRuleEngineResponse, normalizeInput, extractParameters } = require('../services/ruleEngine')
const { getWeather } = require('../services/imd')

// POST /api/advisory
router.post('/', async (req, res, next) => {
  try {
    const { prompt, crop, problem, location, weather, language, inputType } = req.body

    if (!prompt && !problem) {
      return res.status(400).json({ error: 'prompt or problem required' })
    }

    // Normalize input — works for both tap (structured) and voice (text)
    const normalizedText = normalizeInput(
      prompt || { crop, problem, location }
    )

    // Always extract parameters from text for better crop detection
    const extractedParams = extractParameters(normalizedText)

    // Auto fetch weather
    let weatherInfo = weather
    if (!weatherInfo && location) {
      try {
        const weatherData = await getWeather(location)
        weatherInfo = weatherData.cropAction
      } catch (e) {
        weatherInfo = 'Mausam ki jaankari uplabdh nahi'
      }
    }

    const fullPrompt = buildPrompt({
      prompt: normalizedText,
      crop,
      problem,
      location,
      weather: weatherInfo
    })
    const systemPrompt = buildSystemPrompt()

    let response = null
    let source = null
    let ruleDetails = null

    // Layer 1 — NVIDIA
    try {
      console.log('Trying NVIDIA...')
      response = await callNvidia(fullPrompt, systemPrompt)
      source = 'nvidia'
      console.log('NVIDIA success')
    } catch (e) {
      console.log('NVIDIA failed:', e.message)
    }

    // Layer 2 — Groq
    if (!response) {
      try {
        console.log('Trying Groq...')
        response = await callOpenAI(fullPrompt, systemPrompt)
        source = 'groq'
        console.log('Groq success')
      } catch (e) {
        console.log('Groq failed:', e.message)
      }
    }

    // Layer 3 — Smart Rule Engine
    if (!response) {
      console.log('Using Smart Rule Engine...')
      const ruleResult = getRuleEngineResponse(normalizedText)
      response = ruleResult.response
      source = 'rule_engine'
      ruleDetails = {
        confidence: ruleResult.confidence,
        confidenceLabel: ruleResult.confidenceLabel,
        extractedCrop: ruleResult.extractedCrop,
        extractedCropHindi: ruleResult.extractedCropHindi,
        extractedSymptom: ruleResult.extractedSymptom,
        action: ruleResult.action,
        cost: ruleResult.cost,
        urgency: ruleResult.urgency,
        urgencyHindi: ruleResult.urgencyHindi,
      }
    }

    // Resolve crop name — from request, extracted params, or rule engine
    const resolvedCrop =
      crop ||
      extractedParams.cropHindi ||
      ruleDetails?.extractedCropHindi ||
      'Pata nahi'

    return res.json({
      response,
      source,
      crop: resolvedCrop,
      extractedCrop: extractedParams.crop,
      extractedCropHindi: extractedParams.cropHindi,
      extractedSymptom: extractedParams.symptom,
      extractedSymptomHindi: extractedParams.symptomHindi,
      weatherInfo,
      ruleDetails,
      inputType: inputType || 'text',
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
  if (prompt && !crop) return prompt
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