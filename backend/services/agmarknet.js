const axios = require('axios')
const cache = require('./cache')

const AGMARKNET_API_KEY = process.env.AGMARKNET_API_KEY
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

async function getMandiPrices(crop, state) {
  const cacheKey = `mandi_${crop}_${state}`.toLowerCase()

  const cached = cache.mandi.get(cacheKey)
  if (cached) {
    console.log('Mandi prices from cache')
    return { data: cached, fromCache: true }
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        'api-key': AGMARKNET_API_KEY,
        format: 'json',
        limit: 20,
        'filters[commodity]': crop,
        'filters[state]': state,
      },
      timeout: 8000
    })

    const records = response.data.records || []
    const parsed = records.map(r => ({
      mandi: r.market || r.Market,
      district: r.district || r.District,
      state: r.state || r.State,
      commodity: r.commodity || r.Commodity,
      price: parseFloat(r.modal_price || r.Modal_Price || 0),
      minPrice: parseFloat(r.min_price || r.Min_Price || 0),
      maxPrice: parseFloat(r.max_price || r.Max_Price || 0),
      date: r.arrival_date || r.Arrival_Date,
    })).filter(r => r.price > 0)

    cache.mandi.set(cacheKey, parsed)
    return { data: parsed, fromCache: false }

  } catch (err) {
    console.log('AgMarkNet API failed:', err.message)
    return { data: getMockPrices(crop, state), fromCache: false, mock: true }
  }
}

function getMockPrices(crop, state) {
  const mockData = {
    tomato: [
      { mandi: 'Wardha', district: 'Wardha', price: 1100, minPrice: 900, maxPrice: 1300 },
      { mandi: 'Nagpur', district: 'Nagpur', price: 800, minPrice: 700, maxPrice: 1000 },
      { mandi: 'Amravati', district: 'Amravati', price: 950, minPrice: 800, maxPrice: 1100 },
      { mandi: 'Yavatmal', district: 'Yavatmal', price: 700, minPrice: 600, maxPrice: 850 },
      { mandi: 'Chandrapur', district: 'Chandrapur', price: 1000, minPrice: 850, maxPrice: 1150 },
    ],
    wheat: [
      { mandi: 'Wardha', district: 'Wardha', price: 2200, minPrice: 2100, maxPrice: 2300 },
      { mandi: 'Nagpur', district: 'Nagpur', price: 2150, minPrice: 2050, maxPrice: 2250 },
      { mandi: 'Amravati', district: 'Amravati', price: 2250, minPrice: 2150, maxPrice: 2350 },
    ],
    onion: [
      { mandi: 'Nashik', district: 'Nashik', price: 1500, minPrice: 1200, maxPrice: 1800 },
      { mandi: 'Pune', district: 'Pune', price: 1400, minPrice: 1100, maxPrice: 1700 },
      { mandi: 'Mumbai', district: 'Mumbai', price: 1600, minPrice: 1300, maxPrice: 1900 },
    ]
  }

  const cropLower = crop.toLowerCase()
  for (const [key, data] of Object.entries(mockData)) {
    if (cropLower.includes(key)) return data
  }

  return [
    { mandi: 'Local Mandi', district: state, price: 1000, minPrice: 800, maxPrice: 1200 },
  ]
}

function calculateNetEarning(price, distanceKm, quantityKg) {
  const transportCost = Math.round(distanceKm * 2)
  const grossEarning = Math.round((price / 100) * quantityKg)
  const netEarning = Math.round(grossEarning - transportCost)
  return { grossEarning, transportCost, netEarning }
}

const MANDI_DISTANCES = {
  wardha: 22,
  nagpur: 75,
  amravati: 65,
  yavatmal: 55,
  chandrapur: 105,
  nashik: 320,
  pune: 550,
  mumbai: 780,
  panvel: 800,
  satara: 450,
  kolhapur: 600,
  solapur: 350,
  jalgaon: 280,
  ahmednagar: 380,
}

function getDistance(mandiName) {
  const lower = mandiName.toLowerCase()
  for (const [name, dist] of Object.entries(MANDI_DISTANCES)) {
    if (lower.includes(name)) return dist
  }
  return 50
}

module.exports = { getMandiPrices, calculateNetEarning, getDistance }