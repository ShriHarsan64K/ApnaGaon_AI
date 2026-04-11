const express = require('express')
const router = express.Router()
const { getMandiPrices, calculateNetEarning, getDistance } = require('../services/agmarknet')
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')

// POST /api/mandi
router.post('/', async (req, res, next) => {
  try {
    const { crop, quantity, state, location } = req.body

    if (!crop) {
      return res.status(400).json({ error: 'crop is required' })
    }

    const qty = parseFloat(quantity) || 1
    const stateStr = state || 'Maharashtra'

    const { data: prices, fromCache, mock } = await getMandiPrices(crop, stateStr)

    const mandisWithNet = prices.map(mandi => {
      const distance = getDistance(mandi.mandi)
      const { grossEarning, transportCost, netEarning } = calculateNetEarning(
        mandi.price,
        distance,
        qty * 100
      )
      return {
        ...mandi,
        distance,
        transportCost,
        grossEarning,
        netEarning,
        pricePerKg: parseFloat((mandi.price / 100).toFixed(2))
      }
    }).sort((a, b) => b.netEarning - a.netEarning)

    const best = mandisWithNet[0]
    const worst = mandisWithNet[mandisWithNet.length - 1]

    // AI sell timing advice
    let sellAdvice = null
    const advicePrompt = `Crop: ${crop}, Best mandi: ${best?.mandi} at ₹${best?.pricePerKg}/kg, Quantity: ${qty} quintal, State: ${stateStr}. In 2 sentences of simple Hindi — should farmer sell today or wait? Consider seasonal trends.`

    try {
      sellAdvice = await callNvidia(advicePrompt)
    } catch {
      try {
        sellAdvice = await callOpenAI(advicePrompt)
      } catch {
        sellAdvice = `${best?.mandi} mandi mein aaj becho — yeh sabse achha rate hai. Zyada intezaar se rate kam ho sakta hai.`
      }
    }

    const extraEarning = best && worst ? best.netEarning - worst.netEarning : 0
    const daysOfIncome = Math.round(extraEarning / 27)

    return res.json({
      crop,
      quantity: qty,
      mandis: mandisWithNet,
      best: {
        ...best,
        recommendation: `${best?.mandi} mandi mein becho — sabse zyada ₹${best?.netEarning} milega`
      },
      sellAdvice,
      impactLine: extraEarning > 0
        ? `Sabse kharab mandi se ₹${extraEarning} zyaada milega — aapki ${daysOfIncome} din ki extra kamai`
        : null,
      fromCache,
      mock: mock || false,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    next(err)
  }
})

// GET /api/mandi/prices?crop=wheat&state=Maharashtra
router.get('/prices', async (req, res, next) => {
  try {
    const { crop, state } = req.query
    if (!crop) return res.status(400).json({ error: 'crop query param required' })

    const { data, fromCache } = await getMandiPrices(crop, state || 'Maharashtra')
    res.json({ data, fromCache, count: data.length })
  } catch (err) {
    next(err)
  }
})

module.exports = router