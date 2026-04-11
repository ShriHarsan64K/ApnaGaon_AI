const axios = require('axios')

const BHASHINI_API_KEY = process.env.BHASHINI_API_KEY
const BHASHINI_USER_ID = process.env.BHASHINI_USER_ID
const PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline'

// Translate text from any Indian language to English
async function translateToEnglish(text, sourceLang) {
  try {
    const response = await axios.post(
      PIPELINE_URL,
      {
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: sourceLang || 'hi',
                targetLanguage: 'en'
              }
            }
          }
        ],
        inputData: {
          input: [{ source: text }]
        }
      },
      {
        headers: {
          userID: BHASHINI_USER_ID,
          ulcaApiKey: BHASHINI_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    )

    const result = response.data?.pipelineResponse?.[0]?.output?.[0]?.target
    return result || text

  } catch (err) {
    console.log('Bhashini translation failed:', err.message)
    return text // return original if translation fails
  }
}

// Translate English response back to target language
async function translateFromEnglish(text, targetLang) {
  try {
    const response = await axios.post(
      PIPELINE_URL,
      {
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: 'en',
                targetLanguage: targetLang || 'hi'
              }
            }
          }
        ],
        inputData: {
          input: [{ source: text }]
        }
      },
      {
        headers: {
          userID: BHASHINI_USER_ID,
          ulcaApiKey: BHASHINI_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    )

    const result = response.data?.pipelineResponse?.[0]?.output?.[0]?.target
    return result || text

  } catch (err) {
    console.log('Bhashini translation failed:', err.message)
    return text
  }
}

// STT — convert audio to text
async function speechToText(audioBase64, language) {
  try {
    const response = await axios.post(
      PIPELINE_URL,
      {
        pipelineTasks: [
          {
            taskType: 'asr',
            config: {
              language: {
                sourceLanguage: language || 'hi'
              },
              audioFormat: 'flac',
              samplingRate: 16000
            }
          }
        ],
        inputData: {
          audio: [{ audioContent: audioBase64 }]
        }
      },
      {
        headers: {
          userID: BHASHINI_USER_ID,
          ulcaApiKey: BHASHINI_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    return response.data?.pipelineResponse?.[0]?.output?.[0]?.source || ''

  } catch (err) {
    console.log('Bhashini STT failed:', err.message)
    return ''
  }
}

// TTS — convert text to speech
async function textToSpeech(text, language) {
  try {
    const response = await axios.post(
      PIPELINE_URL,
      {
        pipelineTasks: [
          {
            taskType: 'tts',
            config: {
              language: {
                sourceLanguage: language || 'hi'
              },
              gender: 'male',
              samplingRate: 8000
            }
          }
        ],
        inputData: {
          input: [{ source: text }]
        }
      },
      {
        headers: {
          userID: BHASHINI_USER_ID,
          ulcaApiKey: BHASHINI_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    return response.data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent || null

  } catch (err) {
    console.log('Bhashini TTS failed:', err.message)
    return null
  }
}

module.exports = { translateToEnglish, translateFromEnglish, speechToText, textToSpeech }