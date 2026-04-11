const rateLimit = require('express-rate-limit')

const advisoryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: 'Too many advisory requests' }
})

const mandiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many mandi requests' }
})

module.exports = { advisoryLimiter, mandiLimiter }