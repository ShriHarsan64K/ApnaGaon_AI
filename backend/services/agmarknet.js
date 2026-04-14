const axios = require('axios')
const cache = require('./cache')
const offlineDb = require('../data/mandis_offline.json')

const AGMARKNET_API_KEY = process.env.AGMARKNET_API_KEY
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

// Crop name normalization — maps common names to database keys
const CROP_NAME_MAP = {
  'tamatar': 'Tomato', 'tomato': 'Tomato',
  'pyaaz': 'Onion', 'onion': 'Onion', 'pyaz': 'Onion',
  'gehun': 'Wheat', 'wheat': 'Wheat', 'gehu': 'Wheat',
  'chawal': 'Rice', 'rice': 'Rice', 'paddy': 'Rice', 'dhan': 'Rice',
  'kapas': 'Cotton', 'cotton': 'Cotton',
  'soyabean': 'Soybean', 'soybean': 'Soybean', 'soya': 'Soybean',
}

function normalizeCropName(crop) {
  const lower = crop.toLowerCase().trim()
  return CROP_NAME_MAP[lower] || crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase()
}

// ── LIVE API FETCH ──
async function fetchLivePrices(crop, state) {
  const response = await axios.get(BASE_URL, {
    params: {
      'api-key': AGMARKNET_API_KEY,
      format: 'json',
      limit: 20,
      'filters[commodity]': normalizeCropName(crop),
      'filters[state]': state,
    },
    timeout: 8000
  })

  const records = response.data.records || []
  return records.map(r => ({
    mandi: r.market || r.Market,
    district: r.district || r.District,
    state: r.state || r.State,
    commodity: r.commodity || r.Commodity,
    price: parseFloat(r.modal_price || r.Modal_Price || 0),
    minPrice: parseFloat(r.min_price || r.Min_Price || 0),
    maxPrice: parseFloat(r.max_price || r.Max_Price || 0),
    date: r.arrival_date || r.Arrival_Date,
    source: 'live',
  })).filter(r => r.price > 0)
}

// ── OFFLINE DATABASE FETCH ──
function fetchOfflinePrices(crop, state) {
  const normalizedCrop = normalizeCropName(crop)
  const normalizedState = state || 'Maharashtra'

  // Try exact state match first
  const stateData = offlineDb.states[normalizedState]
  if (stateData && stateData.crops[normalizedCrop]) {
    return stateData.crops[normalizedCrop].map(m => ({
      ...m,
      commodity: normalizedCrop,
      state: normalizedState,
      date: 'Cached data',
      source: 'offline',
    }))
  }

  // Try Maharashtra as fallback (most complete dataset)
  const fallbackState = offlineDb.states['Maharashtra']
  if (fallbackState && fallbackState.crops[normalizedCrop]) {
    return fallbackState.crops[normalizedCrop].map(m => ({
      ...m,
      commodity: normalizedCrop,
      state: 'Maharashtra (approximate)',
      date: 'Offline estimate',
      source: 'offline_fallback',
    }))
  }

  // Last resort — generic fallback
  return [
    { mandi: 'Local Mandi', district: normalizedState, state: normalizedState, price: 1000, minPrice: 800, maxPrice: 1200, commodity: normalizedCrop, date: 'Estimate', source: 'mock' }
  ]
}

// ── MAIN FUNCTION ──
async function getMandiPrices(crop, state, forceOffline = false) {
  const cacheKey = `mandi_${crop}_${state}`.toLowerCase().replace(/\s/g, '_')

  // Check cache first
  const cached = cache.mandi.get(cacheKey)
  if (cached) {
    console.log('Mandi prices from cache')
    return { data: cached, fromCache: true, source: 'cache' }
  }

  // Force offline mode (e.g. when device has no internet)
  if (forceOffline) {
    console.log('Using offline mandi database')
    const data = fetchOfflinePrices(crop, state)
    return { data, fromCache: false, source: 'offline', isOffline: true }
  }

  // Try live API
  try {
    console.log('Fetching live mandi prices...')
    const data = await fetchLivePrices(crop, state)
    if (data.length > 0) {
      cache.mandi.set(cacheKey, data)
      return { data, fromCache: false, source: 'live', isOffline: false }
    }
    throw new Error('No records returned')
  } catch (err) {
    console.log('AgMarkNet API failed:', err.message, '— using offline database')
    const data = fetchOfflinePrices(crop, state)
    return { data, fromCache: false, source: 'offline', isOffline: true }
  }
}

// ── DISTANCE & TRANSPORT ──
const MANDI_DISTANCES = {
  wardha: 22, nagpur: 75, amravati: 65, yavatmal: 55, chandrapur: 105,
  nashik: 320, pune: 550, mumbai: 780, panvel: 800, latur: 300,
  aurangabad: 250, solapur: 350, indore: 400, bhopal: 450, jabalpur: 500,
  patna: 800, lucknow: 700, jaipur: 600, agra: 650,
}

function getDistance(mandiName) {
  const lower = mandiName.toLowerCase()
  for (const [name, dist] of Object.entries(MANDI_DISTANCES)) {
    if (lower.includes(name)) return dist
  }
  return 50
}

function calculateNetEarning(price, distanceKm, quantityKg) {
  const transportCost = Math.round(distanceKm * 2)
  const grossEarning = Math.round((price / 100) * quantityKg)
  const netEarning = Math.round(grossEarning - transportCost)
  return { grossEarning, transportCost, netEarning }
}

module.exports = { getMandiPrices, calculateNetEarning, getDistance, normalizeCropName }