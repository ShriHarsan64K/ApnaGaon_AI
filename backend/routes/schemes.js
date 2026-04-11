const express = require('express')
const router = express.Router()
const schemes = require('../data/schemes.json')
const { callNvidia } = require('../services/nvidia')
const { callOpenAI } = require('../services/openai')

// POST /api/schemes
router.post('/', async (req, res, next) => {
  try {
    const { landAcres, cropType, state, hasBankAccount } = req.body

    const profile = {
      landAcres: parseFloat(landAcres) || 1,
      cropType: (cropType || 'general').toLowerCase(),
      state: state || 'Maharashtra',
      hasBankAccount: hasBankAccount !== false,
    }

    const matched = schemes.filter(s => checkEligibility(s, profile))

    const totalCash = matched
      .filter(s => s.cashAmount)
      .reduce((sum, s) => sum + s.cashAmount, 0)

    // AI explanation for top scheme
    let aiExplanation = null
    if (matched.length > 0) {
      const topScheme = matched[0]
      const explainPrompt = `Scheme: ${topScheme.name}, Benefit: ${topScheme.amount}, Documents: ${topScheme.documents.join(', ')}. Ek line mein simple Hindi mein kisan ko batao kya karna hai.`

      try {
        aiExplanation = await callNvidia(explainPrompt)
      } catch {
        try {
          aiExplanation = await callOpenAI(explainPrompt)
        } catch {
          aiExplanation = `${topScheme.name} ke liye ${topScheme.applyAt} mein jaiye aur apne documents le jaiye.`
        }
      }
    }

    const daysOfIncome = totalCash > 0 ? Math.round(totalCash / 27) : 0

    return res.json({
      profile,
      matched,
      count: matched.length,
      totalCashBenefit: totalCash,
      impactLine: totalCash > 0
        ? `₹${totalCash} milne waale hain — aapki ${daysOfIncome} din ki kamai`
        : 'Aapko kai yojanaon ka labh milega',
      aiExplanation,
      fraudWarning: 'Yeh saari yojanaen BILKUL MUFT hain. Koi agent paise maange to woh DHOKHA hai.',
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    next(err)
  }
})

function checkEligibility(scheme, profile) {
  const e = scheme.eligibility
  if (e.maxLandAcres && profile.landAcres > e.maxLandAcres) return false
  if (e.minLandAcres && profile.landAcres < e.minLandAcres) return false
  if (e.requiresBankAccount && !profile.hasBankAccount) return false
  if (e.excludedCrops && e.excludedCrops.includes(profile.cropType)) return false
  if (e.includedStates && !e.includedStates.includes(profile.state)) return false
  if (e.cropTypes && !e.cropTypes.includes('all') && !e.cropTypes.includes(profile.cropType)) return false
  return true
}

router.get('/all', (req, res) => {
  res.json({ schemes, count: schemes.length })
})

module.exports = router