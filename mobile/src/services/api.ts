import axios from 'axios'
import { API } from '../constants/api'

const client = axios.create({
  baseURL: API.BASE_URL,
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' }
})

export async function getAdvisory(
  crop: string,
  problem: string,
  location: string
) {
  try {
    const res = await client.post(API.ENDPOINTS.ADVISORY, {
      crop,
      problem,
      location,
    })
    return { success: true, data: res.data }
  } catch (e: any) {
    console.log('Advisory API failed:', e.message)
    return { success: false, data: null }
  }
}

export async function getMandiPrices(
  crop: string,
  quantity: string,
  state: string
) {
  try {
    const res = await client.post(API.ENDPOINTS.MANDI, {
      crop,
      quantity,
      state,
    })
    return { success: true, data: res.data }
  } catch (e: any) {
    console.log('Mandi API failed:', e.message)
    return { success: false, data: null }
  }
}

export async function getSchemes(
  landAcres: string,
  cropType: string,
  state: string,
  hasBankAccount: boolean
) {
  try {
    const res = await client.post(API.ENDPOINTS.SCHEMES, {
      landAcres,
      cropType,
      state,
      hasBankAccount,
    })
    return { success: true, data: res.data }
  } catch (e: any) {
    console.log('Schemes API failed:', e.message)
    return { success: false, data: null }
  }
}

export async function getWeather(location: string) {
  try {
    const res = await client.get(
      `${API.ENDPOINTS.WEATHER}?location=${location}`
    )
    return { success: true, data: res.data }
  } catch (e: any) {
    console.log('Weather API failed:', e.message)
    return { success: false, data: null }
  }
}

export async function processVoice(
  text: string,
  domain: string,
  crop?: string,
  location?: string
) {
  try {
    const res = await client.post(API.ENDPOINTS.VOICE, {
      text,
      domain,
      crop,
      location,
      language: 'Hindi',
    })
    return { success: true, data: res.data }
  } catch (e: any) {
    console.log('Voice API failed:', e.message)
    return { success: false, data: null }
  }
}