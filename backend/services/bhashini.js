// Bhashini replaced — STT/TTS handled on device
// Translation handled by LLM directly

async function translateToEnglish(text, sourceLang) {
  return text
}

async function translateFromEnglish(text, targetLang) {
  return text
}

async function speechToText(audioBase64, language) {
  return ''
}

async function textToSpeech(text, language) {
  return null
}

module.exports = { translateToEnglish, translateFromEnglish, speechToText, textToSpeech }