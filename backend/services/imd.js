const axios = require('axios')
const cache = require('./cache')

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

async function getWeather(location) {
  const cacheKey = `weather_${location}`.toLowerCase()

  const cached = cache.weather.get(cacheKey)
  if (cached) {
    console.log('Weather from cache')
    return cached
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: `${location},IN`,
        appid: WEATHER_API_KEY,
        units: 'metric',
        cnt: 7,
      },
      timeout: 5000
    })

    const forecasts = response.data.list.slice(0, 7).map(f => ({
      date: new Date(f.dt * 1000).toLocaleDateString('en-IN'),
      temp: Math.round(f.main.temp),
      humidity: f.main.humidity,
      description: f.weather[0].description,
      rain: f.rain ? f.rain['3h'] || 0 : 0,
      windSpeed: f.wind.speed,
      icon: getWeatherEmoji(getCondition(f.weather[0].id)),
      condition: getCondition(f.weather[0].id)
    }))

    const result = {
      location,
      current: forecasts[0],
      forecast: forecasts,
      cropAction: generateCropAction(forecasts),
      alertLevel: getAlertLevel(forecasts),
      weekStrip: generateWeekStrip(forecasts),
      updatedAt: new Date().toISOString()
    }

    cache.weather.set(cacheKey, result)
    return result

  } catch (err) {
    console.log('Weather API failed:', err.message)
    return getMockWeather(location)
  }
}

function getCondition(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm'
  if (weatherId >= 300 && weatherId < 400) return 'drizzle'
  if (weatherId >= 500 && weatherId < 600) return 'rain'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId >= 700 && weatherId < 800) return 'fog'
  if (weatherId === 800) return 'clear'
  if (weatherId > 800) return 'cloudy'
  return 'unknown'
}

function getAlertLevel(forecasts) {
  const tomorrow = forecasts[1] || forecasts[0]
  if (!tomorrow) return 'normal'
  if (tomorrow.condition === 'thunderstorm') return 'emergency'
  if (tomorrow.rain > 20) return 'warning'
  if (tomorrow.condition === 'rain') return 'advisory'
  if (tomorrow.temp > 42) return 'warning'
  return 'normal'
}

function generateCropAction(forecasts) {
  const tomorrow = forecasts[1] || forecasts[0]
  if (!tomorrow) return 'Mausam theek hai. Apna kaam jaari rakho.'

  if (tomorrow.condition === 'thunderstorm') {
    return 'Kal tez toofan aayega — aaj hi fasal baandho aur machinery andar karo.'
  } else if (tomorrow.rain > 10) {
    return 'Kal baarish aayegi — aaj hi pesticide spray karo, kal barbaad ho jaayega. Kaati hui fasal dhak do.'
  } else if (tomorrow.condition === 'rain') {
    return 'Kal halki baarish — sinchai mat karo aaj. Spray bhi nahi karna.'
  } else if (tomorrow.temp > 40) {
    return 'Kal bahut garmi hogi — subah 7 baje se pehle sinchai karo. Dopahar mein khet mein mat jaao.'
  } else {
    return 'Kal mausam theek rahega. Spray aur khet ka kaam kar sakte ho.'
  }
}

function generateWeekStrip(forecasts) {
  return forecasts.map(f => ({
    date: f.date,
    icon: getWeatherEmoji(f.condition),
    action: getShortAction(f.condition, f.rain, f.temp),
    alertLevel: f.condition === 'thunderstorm' ? 'emergency' :
                f.rain > 10 ? 'warning' :
                f.condition === 'rain' ? 'advisory' : 'normal'
  }))
}

function getWeatherEmoji(condition) {
  const map = {
    thunderstorm: '⛈️',
    rain: '🌧️',
    drizzle: '🌦️',
    clear: '☀️',
    cloudy: '⛅',
    fog: '🌫️',
    snow: '❄️',
  }
  return map[condition] || '🌤️'
}

function getShortAction(condition, rain, temp) {
  if (condition === 'thunderstorm') return 'Fasal baandho'
  if (rain > 10) return 'Spray aaj karo'
  if (condition === 'rain') return 'Sinchai mat karo'
  if (temp > 40) return 'Subah kaam karo'
  return 'Kaam kar sakte ho'
}

function getMockWeather(location) {
  return {
    location,
    current: { temp: 32, humidity: 65, description: 'partly cloudy', condition: 'cloudy', rain: 0, icon: '⛅' },
    forecast: [
      { date: 'Aaj', temp: 32, humidity: 65, condition: 'cloudy', rain: 0, icon: '⛅' },
      { date: 'Kal', temp: 29, humidity: 80, condition: 'rain', rain: 8, icon: '🌧️' },
      { date: '+2 din', temp: 31, humidity: 60, condition: 'clear', rain: 0, icon: '☀️' },
      { date: '+3 din', temp: 33, humidity: 55, condition: 'clear', rain: 0, icon: '☀️' },
      { date: '+4 din', temp: 28, humidity: 85, condition: 'rain', rain: 12, icon: '🌧️' },
      { date: '+5 din', temp: 30, humidity: 70, condition: 'cloudy', rain: 2, icon: '⛅' },
      { date: '+6 din', temp: 32, humidity: 60, condition: 'clear', rain: 0, icon: '☀️' },
    ],
    cropAction: 'Kal baarish aayegi — aaj hi pesticide spray karo.',
    alertLevel: 'advisory',
    weekStrip: [
      { date: 'Aaj', icon: '⛅', action: 'Kaam kar sakte ho', alertLevel: 'normal' },
      { date: 'Kal', icon: '🌧️', action: 'Spray aaj karo', alertLevel: 'advisory' },
      { date: '+2 din', icon: '☀️', action: 'Kaam kar sakte ho', alertLevel: 'normal' },
      { date: '+3 din', icon: '☀️', action: 'Kaam kar sakte ho', alertLevel: 'normal' },
      { date: '+4 din', icon: '🌧️', action: 'Spray ready rakho', alertLevel: 'warning' },
      { date: '+5 din', icon: '⛅', action: 'Kaam kar sakte ho', alertLevel: 'normal' },
      { date: '+6 din', icon: '☀️', action: 'Kaam kar sakte ho', alertLevel: 'normal' },
    ],
    updatedAt: new Date().toISOString(),
    mock: true
  }
}

module.exports = { getWeather, generateWeekStrip }