const NodeCache = require('node-cache')

const mandiCache = new NodeCache({ stdTTL: 21600 })
const weatherCache = new NodeCache({ stdTTL: 3600 })
const generalCache = new NodeCache({ stdTTL: 300 })

module.exports = {
  mandi: {
    get: (key) => mandiCache.get(key),
    set: (key, value) => mandiCache.set(key, value),
    del: (key) => mandiCache.del(key),
  },
  weather: {
    get: (key) => weatherCache.get(key),
    set: (key, value) => weatherCache.set(key, value),
  },
  general: {
    get: (key) => generalCache.get(key),
    set: (key, value) => generalCache.set(key, value),
  }
}