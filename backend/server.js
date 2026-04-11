require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const advisoryRoutes = require('./routes/advisory')
const mandiRoutes = require('./routes/mandi')
const schemeRoutes = require('./routes/schemes')
const voiceRoutes = require('./routes/voice')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
})
app.use('/api/', limiter)

app.use('/api/advisory', advisoryRoutes)
app.use('/api/mandi', mandiRoutes)
app.use('/api/schemes', schemeRoutes)
app.use('/api/voice', voiceRoutes)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ApnaGaon AI Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    aiChain: 'NVIDIA → Groq → Rule Engine',
    routes: ['/api/advisory', '/api/mandi', '/api/schemes', '/api/voice', '/health']
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   ApnaGaon AI Backend Running         ║
  ║   Port: ${PORT}                          ║
  ║   AI Chain: NVIDIA → Groq → Rules     ║
  ╚═══════════════════════════════════════╝
  `)
})

module.exports = app