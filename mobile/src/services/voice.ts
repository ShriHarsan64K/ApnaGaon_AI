import Tts from 'react-native-tts'
import { PermissionsAndroid, Platform, Alert } from 'react-native'

let ttsReady = false

export async function setupTTS() {
  try {
    await Tts.setDefaultLanguage('hi-IN')
    await Tts.setDefaultRate(0.45)
    await Tts.setDefaultPitch(1.0)
    ttsReady = true
  } catch (e) {
    console.log('TTS setup error:', e)
  }
}

export function speak(text: string) {
  if (!text) return
  try {
    Tts.stop()
    setTimeout(() => {
      Tts.speak(text)
    }, 200)
  } catch (e) {
    console.log('TTS speak error:', e)
  }
}

export function stopSpeaking() {
  try {
    Tts.stop()
  } catch (e) {}
}

export async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Mic Permission Chahiye',
        message: 'ApnaGaon AI ko aapki awaaz sunne ke liye mic ki zaroorat hai',
        buttonPositive: 'Allow Karo',
        buttonNegative: 'Cancel',
        buttonNeutral: 'Baad Mein',
      }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (e) {
    console.log('Permission error:', e)
    return false
  }
}