import React from 'react'
import {
  View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity
} from 'react-native'
import { colors } from '../constants/colors'
import { speak, stopSpeaking } from '../services/voice'

type Props = {
  text: string
  loading: boolean
  source?: string
}

export default function VoiceResponse({ text, loading, source }: Props) {
  if (!text && !loading) return null

  const sourceLabel =
    source === 'nvidia' ? '⚡ NVIDIA' :
    source === 'groq' ? '🔄 Groq' :
    source === 'rule_engine' ? '📋 Offline' : '🤖 AI'

  const sourceColor =
    source === 'nvidia' ? '#4a7c4a' :
    source === 'groq' ? '#3b82f6' :
    source === 'rule_engine' ? '#e6a817' : '#8b5cf6'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: sourceColor }]} />
        <Text style={[styles.label, { color: sourceColor }]}>ApnaGaon AI</Text>
        {source && (
          <View style={[styles.sourcePill, { backgroundColor: sourceColor + '18' }]}>
            <Text style={[styles.sourceText, { color: sourceColor }]}>{sourceLabel}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.loadingText}>Soch raha hoon...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.response}>{text}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.speakBtn}
              onPress={() => speak(text)}
            >
              <Text style={styles.speakBtnText}>🔊 Phir se suno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stopBtn}
              onPress={stopSpeaking}
            >
              <Text style={styles.stopBtnText}>⏹ Rokein</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(74,124,74,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(74,124,74,0.18)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  sourcePill: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sourceText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  response: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 26,
    fontWeight: '500',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMid,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  speakBtn: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  speakBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stopBtn: {
    backgroundColor: 'rgba(74,124,74,0.1)',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stopBtnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
})