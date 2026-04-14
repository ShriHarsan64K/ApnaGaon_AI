const express = require('express')
const router = express.Router()
const { getMandiPrices, calculateNetEarning, getDistance } = require('../services/agmarknet')
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')

const MAX_REALISTIC_DISTANCE_KM = 150

// POST /api/mandi
router.post('/', async (req, res, next) => {
  try {
    const { crop, quantity, state, location, offline } = req.body

    if (!crop) {
      return res.status(400).json({ error: 'crop is required' })
    }

    const qty = parseFloat(quantity) || 1
    const stateStr = state || 'Maharashtra'
    const forceOffline = offline === true

    // Fetch prices — live or offline
    const { data: prices, fromCache, source: dataSource, isOffline } = await getMandiPrices(
      crop,
      stateStr,
      forceOffline
    )

    // Calculate net earnings for each mandi
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

    // ── DISTANCE FILTER ──
    // Prefer mandis within 150km — realistic for a marginal farmer
    const nearbyMandis = mandisWithNet.filter(m => m.distance <= MAX_REALISTIC_DISTANCE_KM)
    const bestMandis = nearbyMandis.length > 0 ? nearbyMandis : mandisWithNet

    const best = bestMandis[0]
    const worst = bestMandis[bestMandis.length - 1]

    // AI sell timing advice
    let sellAdvice = null
    const advicePrompt = `Fasal: ${crop}, Sabse achhi mandi: ${best?.mandi} ₹${best?.pricePerKg}/kg, Quantity: ${qty} quintal, State: ${stateStr}. 2 sentences simple Hindi mein — aaj becho ya ruko?`

    try {
      sellAdvice = await callNvidia(advicePrompt)
    } catch {
      try {
        sellAdvice = await callOpenAI(advicePrompt)
      } catch {
        sellAdvice = `${best?.mandi} mandi mein aaj becho — yeh sabse achha rate hai. Zyada intezaar karne se rate kam ho sakta hai.`
      }
    }

    // ₹27/day impact calculation
    const extraEarning = best && worst ? best.netEarning - worst.netEarning : 0
    const daysOfIncome = Math.round(extraEarning / 27)

    // Distance warning for any mandi over 150km
    const hasDistantMandis = mandisWithNet.some(m => m.distance > MAX_REALISTIC_DISTANCE_KM)

    return res.json({
      crop,
      quantity: qty,
      mandis: bestMandis,           // Only nearby mandis shown
      allMandis: mandisWithNet,     // Full list if needed
      best: {
        ...best,
        recommendation: `${best?.mandi} mandi mein becho — sabse zyada ₹${best?.netEarning} milega`
      },
      sellAdvice,
      impactLine: extraEarning > 0
        ? `Sabse kharab mandi se ₹${extraEarning} zyaada milega — aapki ${daysOfIncome} din ki extra kamai`
        : null,
      dataSource,
      isOffline: isOffline || false,
      offlineNote: isOffline
        ? 'Internet nahi tha — approximate prices diye hain. Online hone par live prices milenge.'
        : null,
      hasDistantMandisFiltered: hasDistantMandis,
      fromCache,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    next(err)
  }
})

// GET /api/mandi/prices?crop=wheat&state=Maharashtra
router.get('/prices', async (req, res, next) => {
  try {
    const { crop, state, offline } = req.query
    if (!crop) return res.status(400).json({ error: 'crop query param required' })

    const { data, fromCache, source } = await getMandiPrices(
      crop,
      state || 'Maharashtra',
      offline === 'true'
    )
    res.json({ data, fromCache, source, count: data.length })
  } catch (err) {
    next(err)
  }
})

module.exports = router