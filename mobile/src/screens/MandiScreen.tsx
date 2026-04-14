import React, { useState } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput, Dimensions,
} from 'react-native'
import OfflineBanner from '../components/OfflineBanner'
import { colors } from '../constants/colors'
import { getMandiPrices } from '../services/api'
import { speak } from '../services/voice'

const { width } = Dimensions.get('window')

const CROPS = [
  { label: 'Tamatar', emoji: '🍅' },
  { label: 'Pyaaz', emoji: '🧅' },
  { label: 'Kapas', emoji: '🌿' },
  { label: 'Soyabean', emoji: '🫘' },
  { label: 'Gehun', emoji: '🌾' },
  { label: 'Chawal', emoji: '🍚' },
]

const MOCK_PRICES = [
  { mandi: 'Wardha', price: 1100, distance: 22, district: 'Wardha' },
  { mandi: 'Nagpur', price: 800, distance: 75, district: 'Nagpur' },
  { mandi: 'Amravati', price: 950, distance: 65, district: 'Amravati' },
  { mandi: 'Yavatmal', price: 700, distance: 55, district: 'Yavatmal' },
  { mandi: 'Chandrapur', price: 1000, distance: 105, district: 'Chandrapur' },
]

export default function MandiScreen({ navigation }: any) {
  const [step, setStep] = useState(0)
  const [crop, setCrop] = useState('')
  const [cropEmoji, setCropEmoji] = useState('')
  const [quantity, setQuantity] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [best, setBest] = useState<any>(null)
  const [impactLine, setImpactLine] = useState('')
  const [sellAdvice, setSellAdvice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    if (!quantity) return
    setLoading(true)
    const { success, data } = await getMandiPrices(crop, quantity, 'Maharashtra')
    if (success && data) {
      setResults(data.mandis || [])
      setBest(data.best || null)
      setImpactLine(data.impactLine || '')
      setSellAdvice(data.sellAdvice || '')
      if (data.best?.recommendation) speak(data.best.recommendation)
    } else {
      const qty = parseFloat(quantity) || 1
      const mock = MOCK_PRICES.map(m => ({
        ...m,
        transportCost: Math.round(m.distance * 2),
        totalEarning: Math.round(m.price * qty - m.distance * 2),
        pricePerKg: (m.price / 100).toFixed(2),
        netEarning: Math.round(m.price * qty - m.distance * 2),
      })).sort((a, b) => b.totalEarning - a.totalEarning)
      setResults(mock)
      setBest(mock[0])
      speak(`${mock[0].mandi} mandi mein becho — sabse zyada paisa milega`)
    }
    setLoading(false)
    setStep(2)
  }

  const reset = () => {
    setStep(0); setCrop(''); setQuantity('')
    setResults([]); setBest(null)
    setImpactLine(''); setSellAdvice('')
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>💰 Mandi Bhav</Text>
            <Text style={styles.subtitle}>5 mandion ka bhav compare karein</Text>
          </View>
        </View>

        <View style={styles.progress}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.progressBar, i <= step && styles.progressActive]} />
          ))}
        </View>

        {/* STEP 0 */}
        {step === 0 && (
          <View>
            <Text style={styles.question}>Kaunsi fasal bechni hai?</Text>
            <View style={styles.cropGrid}>
              {CROPS.map(c => (
                <TouchableOpacity
                  key={c.label}
                  style={[styles.cropBtn, { width: CROP_W }]}
                  onPress={() => { setCrop(c.label); setCropEmoji(c.emoji); setStep(1) }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cropEmoji}>{c.emoji}</Text>
                  <Text style={styles.cropLabel}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <View>
            <Text style={styles.question}>{cropEmoji} {crop} kitna hai? (Quintal)</Text>
            <TextInput
              style={styles.input}
              placeholder="Jaise: 4"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholderTextColor={colors.textLight}
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>💡 Transport ka kharcha apne aap calculate hoga</Text>
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              onPress={handleCompare}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Bhav dekh rahe hain...' : 'Bhav Compare Karo →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && results.length > 0 && (
          <View>
            <Text style={styles.question}>{cropEmoji} {crop} · {quantity} Quintal</Text>

            <View style={styles.bestCard}>
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>✅ SABSE ACHHA</Text>
              </View>
              <Text style={styles.bestMandi}>{best?.mandi} Mandi</Text>
              <Text style={styles.bestEarning}>₹{best?.totalEarning || best?.netEarning}</Text>
              <Text style={styles.bestDetail}>
                ₹{best?.pricePerKg}/kg · {best?.distance}km · Transport ₹{best?.transportCost}
              </Text>
            </View>

            {impactLine ? (
              <View style={styles.impactBox}>
                <Text style={styles.impactText}>💪 {impactLine}</Text>
              </View>
            ) : null}

            {sellAdvice ? (
              <View style={styles.adviceBox}>
                <Text style={styles.adviceLabel}>AI Salah</Text>
                <Text style={styles.adviceText}>{sellAdvice}</Text>
              </View>
            ) : null}

            <Text style={styles.sectionLabel}>SABHI MANDI</Text>
            {results.map((r, i) => (
              <View key={`${r.mandi}-${i}`} style={[styles.mandiRow, i === 0 && styles.mandiRowBest]}>
                <View>
                  <Text style={styles.mandiName}>{r.mandi}</Text>
                  <Text style={styles.mandiSub}>{r.distance}km · ₹{r.transportCost} transport</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.mandiPrice}>₹{r.pricePerKg}/kg</Text>
                  <Text style={styles.mandiNet}>₹{r.totalEarning || r.netEarning} kul</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.secondaryBtn} onPress={reset} activeOpacity={0.8}>
              <Text style={styles.secondaryBtnText}>Dobara Dekho</Text>
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
  question: { fontSize: 20, fontWeight: '800', color: colors.textDark, marginBottom: 16, lineHeight: 28 },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cropBtn: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2,
  },
  cropEmoji: { fontSize: 30, marginBottom: 6 },
  cropLabel: { fontSize: 12, fontWeight: '700', color: colors.textDark },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 16, fontSize: 24, fontWeight: '700',
    color: colors.textDark, marginBottom: 12,
  },
  infoBox: { backgroundColor: colors.tagBg, borderRadius: 10, padding: 12, marginBottom: 14 },
  infoText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: 50,
    paddingVertical: 16, alignItems: 'center', elevation: 4,
  },
  btnDisabled: { backgroundColor: colors.primaryLight },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bestCard: {
    backgroundColor: colors.primary, borderRadius: 18,
    padding: 20, marginBottom: 12, elevation: 4,
  },
  bestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  bestBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700', letterSpacing: 1 },
  bestMandi: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  bestEarning: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 6 },
  bestDetail: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  impactBox: {
    backgroundColor: 'rgba(74,124,74,0.08)', borderRadius: 12,
    padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(74,124,74,0.2)',
  },
  impactText: { fontSize: 13, color: colors.primaryDark, fontWeight: '700' },
  adviceBox: {
    backgroundColor: colors.white, borderRadius: 12,
    padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  adviceLabel: {
    fontSize: 10, color: colors.textLight, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
  },
  adviceText: { fontSize: 13, color: colors.textDark, lineHeight: 20 },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textLight,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10,
  },
  mandiRow: {
    backgroundColor: colors.white, borderRadius: 12, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: colors.border, elevation: 1,
  },
  mandiRowBest: { borderColor: colors.primary, borderWidth: 2 },
  mandiName: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  mandiSub: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  mandiPrice: { fontSize: 15, fontWeight: '800', color: colors.primary },
  mandiNet: { fontSize: 12, color: colors.textMid, marginTop: 2, fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: colors.white, borderRadius: 50, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary, marginTop: 14,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
})