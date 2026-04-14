import React, { useState } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity,
} from 'react-native'
import OfflineBanner from '../components/OfflineBanner'
import { colors } from '../constants/colors'
import { getSchemes } from '../services/api'
import { speak } from '../services/voice'

const LAND_OPTIONS = [
  { label: '1 acre se kam', emoji: '🌱', value: '0.5' },
  { label: '1 se 2 acre', emoji: '🌿', value: '1.5' },
  { label: '2 se 5 acre', emoji: '🌾', value: '3' },
  { label: '5 acre se zyada', emoji: '🏡', value: '6' },
]

const CROP_OPTIONS = ['Gehun', 'Chawal', 'Kapas', 'Soyabean', 'Sabzi', 'Aur kuch']
const STATE_OPTIONS = ['Maharashtra', 'Bihar', 'UP', 'MP', 'Rajasthan', 'Doosra']

const FALLBACK = [
  { name: 'PM-KISAN', amount: '₹6,000 har saal', tag: 'Seedha Transfer', emoji: '💰', color: '#4a7c4a', desc: 'Seedha bank mein 3 kistoon mein paisa milta hai.', documents: ['Aadhar Card', 'Bank Passbook', 'Khasra ya Khatauni'], applyAt: 'CSC Centre ya pmkisan.gov.in' },
  { name: 'PMFBY', amount: 'Fasal kharab ho to muavza', tag: 'Bima', emoji: '🛡️', color: '#2d7a5a', desc: 'Baarish ya sookhe se fasal kharab ho to paisa milta hai.', documents: ['Aadhar', 'Bank Account', 'Zameen ka praman'], applyAt: 'Nazdiki bank' },
  { name: 'Kisan Credit Card', amount: '₹3 lakh — 4% byaaj', tag: 'Loan', emoji: '💳', color: '#4a5a7c', desc: 'Khad beej ke liye sasta loan milta hai.', documents: ['Aadhar', 'Zameen ke kagaz', 'Photo'], applyAt: 'Nazdiki bank' },
  { name: 'PM-KUSUM', amount: 'Solar pump pe 90% choot', tag: 'Subsidy', emoji: '☀️', color: '#7c6a2d', desc: 'Solar pump lagao — sarkar 90% paisa degi.', documents: ['Aadhar', 'Zameen ka praman', 'Bank Account'], applyAt: 'State agriculture dept' },
]

export default function SchemeScreen({ navigation }: any) {
  const [step, setStep] = useState(0)
  const [land, setLand] = useState('')
  const [landValue, setLandValue] = useState('1')
  const [crop, setCrop] = useState('')
  const [state, setState] = useState('')
  const [matched, setMatched] = useState<any[]>([])
  const [impactLine, setImpactLine] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMatch = async (bankAccount: boolean) => {
    setLoading(true)
    const { success, data } = await getSchemes(landValue, crop, state, bankAccount)
    if (success && data) {
      setMatched(data.matched || [])
      setImpactLine(data.impactLine || '')
      if (data.impactLine) speak(data.impactLine)
    } else {
      setMatched(FALLBACK)
      speak('Aapko PM-KISAN mein 6000 rupaye milenge har saal.')
    }
    setLoading(false)
    setStep(4)
  }

  const reset = () => {
    setStep(0); setLand(''); setCrop(''); setState(''); setMatched([]); setImpactLine('')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner mode="online" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>📋 Sarkari Yojana</Text>
            <Text style={styles.subtitle}>Aapke liye kaun si yojana sahi hai</Text>
          </View>
        </View>

        {step < 4 && (
          <View style={styles.progress}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.progressBar, i <= step && styles.progressActive]} />
            ))}
          </View>
        )}

        {/* STEP 0 */}
        {step === 0 && (
          <View>
            <Text style={styles.question}>Aapke paas kitni zameen hai?</Text>
            {LAND_OPTIONS.map(l => (
              <TouchableOpacity
                key={l.label}
                style={styles.listBtn}
                onPress={() => { setLand(l.label); setLandValue(l.value); setStep(1) }}
                activeOpacity={0.7}
              >
                <Text style={styles.listEmoji}>{l.emoji}</Text>
                <Text style={styles.listText}>{l.label}</Text>
                <Text style={styles.listArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <View>
            <Text style={styles.question}>Aap kya ugaate hain?</Text>
            <View style={styles.chipGrid}>
              {CROP_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c} style={styles.chip}
                  onPress={() => { setCrop(c); setStep(2) }} activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <View>
            <Text style={styles.question}>Aap kaunse state mein hain?</Text>
            <View style={styles.chipGrid}>
              {STATE_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s} style={styles.chip}
                  onPress={() => { setState(s); setStep(3) }} activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <View>
            <Text style={styles.question}>Kya aapka bank account hai?</Text>
            <TouchableOpacity
              style={[styles.listBtn, loading && { opacity: 0.6 }]}
              onPress={() => handleMatch(true)}
              disabled={loading} activeOpacity={0.7}
            >
              <Text style={styles.listEmoji}>✅</Text>
              <Text style={styles.listText}>{loading ? 'Dhundh rahe hain...' : 'Haan, hai'}</Text>
              <Text style={styles.listArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listBtn, loading && { opacity: 0.6 }]}
              onPress={() => handleMatch(false)}
              disabled={loading} activeOpacity={0.7}
            >
              <Text style={styles.listEmoji}>🏦</Text>
              <Text style={styles.listText}>Nahi, abhi nahi hai</Text>
              <Text style={styles.listArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <View>
            <View style={styles.matchHeader}>
              <Text style={styles.matchCount}>🎉 {matched.length} Yojanaen Mili!</Text>
              <Text style={styles.matchSub}>{land} · {crop} · {state}</Text>
            </View>

            {impactLine ? (
              <View style={styles.impactBox}>
                <Text style={styles.impactText}>💪 {impactLine}</Text>
              </View>
            ) : null}

            {matched.map((s: any, idx: number) => (
              <View key={idx} style={[styles.schemeCard, { borderTopColor: s.color || colors.primary }]}>
                <View style={styles.schemeTop}>
                  <View style={[styles.schemeIcon, { backgroundColor: (s.color || colors.primary) + '18' }]}>
                    <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.schemeNameRow}>
                      <Text style={styles.schemeName}>{s.name}</Text>
                      {s.tag && (
                        <View style={[styles.schemeTag, { backgroundColor: (s.color || colors.primary) + '18' }]}>
                          <Text style={[styles.schemeTagText, { color: s.color || colors.primary }]}>{s.tag}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.schemeAmount, { color: s.color || colors.primary }]}>{s.amount}</Text>
                  </View>
                </View>
                <Text style={styles.schemeDesc}>{s.desc}</Text>
                {s.documents && (
                  <View style={styles.docBox}>
                    <Text style={styles.docTitle}>📄 Zaroori Kagaz</Text>
                    {s.documents.map((d: string, di: number) => (
                      <Text key={di} style={styles.docItem}>· {d}</Text>
                    ))}
                  </View>
                )}
                {s.applyAt && (
                  <View style={styles.applyBox}>
                    <Text style={styles.applyText}>📍 {s.applyAt}</Text>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.fraudBox}>
              <Text style={styles.fraudTitle}>⚠️ Dhyan Rakhein!</Text>
              <Text style={styles.fraudText}>
                Yeh saari yojanaen BILKUL MUFT hain. Koi agent paise maange to woh DHOKHA hai.
              </Text>
            </View>

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
  listBtn: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1,
  },
  listEmoji: { fontSize: 22 },
  listText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textDark },
  listArrow: { fontSize: 16, color: colors.primaryLight },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 100, paddingVertical: 12, paddingHorizontal: 18, elevation: 1,
  },
  chipText: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  matchHeader: {
    backgroundColor: colors.white, borderRadius: 14, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: colors.border, elevation: 2,
  },
  matchCount: { fontSize: 22, fontWeight: '900', color: colors.textDark, marginBottom: 4 },
  matchSub: { fontSize: 12, color: colors.textLight },
  impactBox: {
    backgroundColor: 'rgba(74,124,74,0.08)', borderRadius: 12, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(74,124,74,0.2)',
  },
  impactText: { fontSize: 13, color: colors.primaryDark, fontWeight: '700', lineHeight: 20 },
  schemeCard: {
    backgroundColor: colors.white, borderRadius: 14, padding: 16,
    marginBottom: 12, borderTopWidth: 3, borderWidth: 1, borderColor: colors.border, elevation: 2,
  },
  schemeTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  schemeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  schemeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
  schemeName: { fontSize: 14, fontWeight: '800', color: colors.textDark },
  schemeTag: { borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 },
  schemeTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  schemeAmount: { fontSize: 13, fontWeight: '700' },
  schemeDesc: { fontSize: 13, color: colors.textMid, lineHeight: 20, marginBottom: 10 },
  docBox: { backgroundColor: colors.background, borderRadius: 10, padding: 12, marginBottom: 10 },
  docTitle: { fontSize: 10, fontWeight: '700', color: colors.textLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  docItem: { fontSize: 13, color: colors.textDark, fontWeight: '500', marginBottom: 4 },
  applyBox: { backgroundColor: colors.tagBg, borderRadius: 10, padding: 10 },
  applyText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  fraudBox: {
    backgroundColor: 'rgba(192,57,43,0.06)', borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.2)', borderRadius: 14, padding: 16, marginBottom: 14,
  },
  fraudTitle: { fontSize: 14, fontWeight: '800', color: '#c0392b', marginBottom: 6 },
  fraudText: { fontSize: 13, color: '#c0392b', lineHeight: 20 },
  secondaryBtn: {
    backgroundColor: colors.white, borderRadius: 50, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary, marginBottom: 8,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
})