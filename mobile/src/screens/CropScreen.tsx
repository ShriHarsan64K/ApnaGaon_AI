// mobile/src/screens/CropScreen.tsx
// COPY THIS ENTIRE FILE

import React, { useState } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Dimensions,
} from 'react-native'
import MicButton from '../components/MicButton'
import ReportCard from '../components/ReportCard'
import VoiceResponse from '../components/VoiceResponse'
import OfflineBanner from '../components/OfflineBanner'
import { colors } from '../constants/colors'
import { speak } from '../services/voice'
import { API } from '../constants/api'

const { width } = Dimensions.get('window')

const CROPS = [
  { label: 'Gehun', emoji: '🌾', english: 'wheat' },
  { label: 'Chawal', emoji: '🍚', english: 'rice' },
  { label: 'Kapas', emoji: '🌿', english: 'cotton' },
  { label: 'Soyabean', emoji: '🫘', english: 'soybean' },
  { label: 'Tamatar', emoji: '🍅', english: 'tomato' },
  { label: 'Pyaaz', emoji: '🧅', english: 'onion' },
]

const PROBLEMS = [
  { label: 'Patte peele ho rahe hain', emoji: '🍂' },
  { label: 'Keede lag gaye hain', emoji: '🐛' },
  { label: 'Fasal sukh rahi hai', emoji: '🏜️' },
  { label: 'Daane nahi aa rahe', emoji: '❌' },
  { label: 'Patte gir rahe hain', emoji: '🍃' },
  { label: 'Kuch aur dikkat hai', emoji: '❓' },
]

const VOICE_TO_CROP: Record<string, string> = {
  'gehun': 'Gehun', 'wheat': 'Gehun', 'gehu': 'Gehun',
  'chawal': 'Chawal', 'rice': 'Chawal', 'dhan': 'Chawal',
  'kapas': 'Kapas', 'cotton': 'Kapas',
  'soyabean': 'Soyabean', 'soya': 'Soyabean', 'soybean': 'Soyabean',
  'tamatar': 'Tamatar', 'tomato': 'Tamatar',
  'pyaaz': 'Pyaaz', 'onion': 'Pyaaz', 'piyaz': 'Pyaaz',
}

const VOICE_TO_PROBLEM: Record<string, string> = {
  'peele': 'Patte peele ho rahe hain',
  'yellow': 'Patte peele ho rahe hain',
  'pila': 'Patte peele ho rahe hain',
  'keede': 'Keede lag gaye hain',
  'kida': 'Keede lag gaye hain',
  'pest': 'Keede lag gaye hain',
  'sukh': 'Fasal sukh rahi hai',
  'sukha': 'Fasal sukh rahi hai',
  'dry': 'Fasal sukh rahi hai',
  'daane': 'Daane nahi aa rahe',
  'yield': 'Daane nahi aa rahe',
  'patte': 'Patte gir rahe hain',
}

function detectFromVoice(text: string): { crop?: string; problem?: string } {
  const lower = text.toLowerCase()
  const result: { crop?: string; problem?: string } = {}
  for (const [keyword, cropLabel] of Object.entries(VOICE_TO_CROP)) {
    if (lower.includes(keyword)) { result.crop = cropLabel; break }
  }
  for (const [keyword, problemLabel] of Object.entries(VOICE_TO_PROBLEM)) {
    if (lower.includes(keyword)) { result.problem = problemLabel; break }
  }
  return result
}

function getLocalFallback(cropName: string, problemName: string): string {
  const lower = problemName.toLowerCase()
  if (lower.includes('peele') || lower.includes('yellow')) {
    return `${cropName} mein peele patte nitrogen ki kami se hote hain. Urea spray karo — 2% concentration, 200 litre paani mein. Kharcha ₹80/acre. Subah ya shaam ko spray karo.`
  }
  if (lower.includes('keede') || lower.includes('pest')) {
    return `${cropName} mein keede ke liye Neem oil spray karo — 5ml/litre paani. Kharcha ₹50/acre. Subah spray karo.`
  }
  if (lower.includes('sukh') || lower.includes('dry')) {
    return `${cropName} sukh rahi hai — turant sinchai karo. Subah ya shaam ko paani do, dopahar mein nahi.`
  }
  if (lower.includes('daane') || lower.includes('yield')) {
    return `${cropName} mein daane nahi aa rahe — boron spray karo. Kharcha ₹60/acre.`
  }
  if (lower.includes('patte') || lower.includes('leaves')) {
    return `${cropName} mein patte gir rahe hain — micronutrient spray karo. Kharcha ₹90/acre.`
  }
  return `${cropName} ki samasya ke liye Kisan Call Centre pe call karein: 1800-180-1551. Bilkul free hai.`
}

export default function CropScreen({ navigation }: any) {
  const [step, setStep] = useState(0)
  const [crop, setCrop] = useState('')
  const [problem, setProblem] = useState('')
  const [voiceText, setVoiceText] = useState('')
  const [inputMode, setInputMode] = useState<'tap' | 'voice'>('tap')
  const [response, setResponse] = useState('')
  const [source, setSource] = useState('')
  const [weatherInfo, setWeatherInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGetAdvice = async () => {
    setLoading(true)
    setStep(3)

    try {
      console.log('Calling API:', `${API.BASE_URL}${API.ENDPOINTS.ADVISORY}`)

      const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.ADVISORY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: crop,
          problem: problem,
          location: 'Wardha',
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      console.log('API success:', data.source)

      if (data.response) {
        setResponse(data.response)
        setSource(data.source || 'nvidia')
        setWeatherInfo(data.weatherInfo || '')
        speak(data.response)
      } else {
        throw new Error('Empty response')
      }

    } catch (err) {
      console.log('API failed, using local fallback:', err)
      const fallback = getLocalFallback(crop, problem)
      setResponse(fallback)
      setSource('rule_engine')
      speak(fallback)
    }

    setLoading(false)
  }

  const handleVoiceResult = (text: string) => {
    setVoiceText(text)
    const detected = detectFromVoice(text)
    if (step === 0 && detected.crop) {
      setCrop(detected.crop)
      if (detected.problem) { setProblem(detected.problem); setStep(2) }
      else { setStep(1) }
    } else if (step === 1 && detected.problem) {
      setProblem(detected.problem)
      setStep(2)
    }
  }

  const reset = () => {
    setStep(0); setCrop(''); setProblem(''); setVoiceText('')
    setResponse(''); setSource(''); setWeatherInfo('')
    setLoading(false); setInputMode('tap')
  }

  const CROP_W = (width - 52) / 3

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner mode="online" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>🌿 Fasal Salah</Text>
            <Text style={styles.subtitle}>Tap karein ya bolein</Text>
          </View>
        </View>

        {/* PROGRESS */}
        {step < 3 && (
          <View style={styles.progress}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.progressBar, i <= step && styles.progressActive]} />
            ))}
          </View>
        )}

        {/* STEP 0 — Crop selection */}
        {step === 0 && (
          <View>
            <Text style={styles.question}>Aap kya ugaate hain?</Text>

            <View style={styles.inputToggle}>
              <TouchableOpacity
                style={[styles.toggleBtn, inputMode === 'tap' && styles.toggleBtnActive]}
                onPress={() => setInputMode('tap')}
              >
                <Text style={[styles.toggleText, inputMode === 'tap' && styles.toggleTextActive]}>
                  👆 Tap karein
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, inputMode === 'voice' && styles.toggleBtnActive]}
                onPress={() => setInputMode('voice')}
              >
                <Text style={[styles.toggleText, inputMode === 'voice' && styles.toggleTextActive]}>
                  🎤 Bolein
                </Text>
              </TouchableOpacity>
            </View>

            {inputMode === 'tap' ? (
              <View style={styles.cropGrid}>
                {CROPS.map(c => (
                  <TouchableOpacity
                    key={c.label}
                    style={[styles.cropBtn, { width: CROP_W }, crop === c.label && styles.cropBtnSelected]}
                    onPress={() => { setCrop(c.label); setStep(1) }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cropEmoji}>{c.emoji}</Text>
                    <Text style={[styles.cropLabel, crop === c.label && { color: colors.primary }]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View>
                <MicButton
                  label="Fasal ka naam bolein"
                  onVoiceResult={handleVoiceResult}
                />
                {voiceText ? (
                  <View style={styles.voiceDetected}>
                    <Text style={styles.voiceDetectedLabel}>Suna:</Text>
                    <Text style={styles.voiceDetectedText}>"{voiceText}"</Text>
                    {crop ? <Text style={styles.voiceMatch}>✅ {crop} detect hua</Text> : null}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* STEP 1 — Problem selection */}
        {step === 1 && (
          <View>
            <View style={styles.cropChip}>
              <Text style={styles.cropChipText}>{crop}</Text>
            </View>
            <Text style={styles.question}>Kya dikkat hai?</Text>

            <View style={styles.inputToggle}>
              <TouchableOpacity
                style={[styles.toggleBtn, inputMode === 'tap' && styles.toggleBtnActive]}
                onPress={() => setInputMode('tap')}
              >
                <Text style={[styles.toggleText, inputMode === 'tap' && styles.toggleTextActive]}>
                  👆 Tap karein
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, inputMode === 'voice' && styles.toggleBtnActive]}
                onPress={() => setInputMode('voice')}
              >
                <Text style={[styles.toggleText, inputMode === 'voice' && styles.toggleTextActive]}>
                  🎤 Bolein
                </Text>
              </TouchableOpacity>
            </View>

            {inputMode === 'tap' ? (
              PROBLEMS.map(p => (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.listBtn, problem === p.label && styles.listBtnSelected]}
                  onPress={() => { setProblem(p.label); setStep(2) }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.listEmoji}>{p.emoji}</Text>
                  <Text style={[styles.listText, problem === p.label && { color: colors.primary }]}>
                    {p.label}
                  </Text>
                  <Text style={styles.listArrow}>→</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View>
                <MicButton
                  label="Dikkat bolein — jaise 'keede lag gaye'"
                  onVoiceResult={handleVoiceResult}
                />
                {voiceText ? (
                  <View style={styles.voiceDetected}>
                    <Text style={styles.voiceDetectedLabel}>Suna:</Text>
                    <Text style={styles.voiceDetectedText}>"{voiceText}"</Text>
                    {problem ? <Text style={styles.voiceMatch}>✅ Detect hua: {problem}</Text> : null}
                  </View>
                ) : null}
                <Text style={styles.orText}>— ya tapke chunein —</Text>
                {PROBLEMS.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={styles.listBtnSmall}
                    onPress={() => { setProblem(p.label); setStep(2) }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.listEmoji}>{p.emoji}</Text>
                    <Text style={styles.listTextSmall}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* STEP 2 — Confirm */}
        {step === 2 && (
          <View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Aapki fasal</Text>
              <Text style={styles.summaryValue}>{crop} · {problem}</Text>
              {voiceText ? <Text style={styles.summaryVoice}>🎤 "{voiceText}"</Text> : null}
            </View>
            <Text style={styles.question}>Aur kuch bolna hai? (zaroori nahi)</Text>
            <MicButton
              label="Aur detail bolein"
              onVoiceResult={(text) => setVoiceText(prev => prev + ' ' + text)}
            />
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleGetAdvice}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Salah Lo ✓</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3 — Results */}
        {step === 3 && (
          <View>
            <Text style={styles.reportTitle}>Aapki Fasal Report</Text>
            {weatherInfo ? (
              <ReportCard emoji="🌦️" title="Mausam Khabar" value={weatherInfo} level="medium" />
            ) : null}
            <ReportCard emoji="🌾" title="Fasal" value={crop} level="info" />
            <ReportCard emoji="⚠️" title="Samasya" value={problem} level="high" />
            <VoiceResponse text={response} loading={loading} source={source} />
            <TouchableOpacity style={styles.secondaryBtn} onPress={reset} activeOpacity={0.8}>
              <Text style={styles.secondaryBtnText}>Dobara Poochho</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  backIcon: { fontSize: 18, color: colors.primary, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 11, color: colors.textLight, marginTop: 1 },
  progress: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  progressActive: { backgroundColor: colors.primary },
  question: { fontSize: 20, fontWeight: '800', color: colors.textDark, marginBottom: 14, lineHeight: 28 },
  inputToggle: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 100,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.white, alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontSize: 13, fontWeight: '700', color: colors.textMid },
  toggleTextActive: { color: '#fff' },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cropBtn: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2,
  },
  cropBtnSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.tagBg },
  cropEmoji: { fontSize: 30, marginBottom: 6 },
  cropLabel: { fontSize: 12, fontWeight: '700', color: colors.textDark },
  listBtn: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1,
  },
  listBtnSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.tagBg },
  listBtnSmall: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 11, marginBottom: 6,
    flexDirection: 'row', alignItems: 'center', gap: 10, elevation: 1,
  },
  listEmoji: { fontSize: 20 },
  listText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textDark },
  listTextSmall: { flex: 1, fontSize: 13, fontWeight: '500', color: colors.textDark },
  listArrow: { fontSize: 16, color: colors.primaryLight },
  voiceDetected: {
    backgroundColor: colors.tagBg, borderRadius: 12, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: colors.border,
  },
  voiceDetectedLabel: {
    fontSize: 10, color: colors.textLight, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
  },
  voiceDetectedText: { fontSize: 14, color: colors.textDark, fontWeight: '500', fontStyle: 'italic' },
  voiceMatch: { fontSize: 13, color: colors.primary, fontWeight: '700', marginTop: 6 },
  orText: { fontSize: 12, color: colors.textLight, textAlign: 'center', marginVertical: 12 },
  cropChip: {
    backgroundColor: colors.tagBg, borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 6,
    alignSelf: 'flex-start', marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  cropChipText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  summaryCard: {
    backgroundColor: colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 10, color: colors.textLight, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4,
  },
  summaryValue: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  summaryVoice: { fontSize: 12, color: colors.textMid, marginTop: 4, fontStyle: 'italic' },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: 50,
    paddingVertical: 16, alignItems: 'center', elevation: 4, marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  reportTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark, marginBottom: 14 },
  secondaryBtn: {
    backgroundColor: colors.white, borderRadius: 50, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary, marginTop: 8,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
})