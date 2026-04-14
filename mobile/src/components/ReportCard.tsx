import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  title: string
  value: string
  emoji: string
  level: 'low' | 'medium' | 'high' | 'info'
}

const levelColors = {
  low: '#4a7c4a',
  medium: '#e6a817',
  high: '#c0392b',
  info: '#3b82f6',
}

const levelBg = {
  low: 'rgba(74,124,74,0.06)',
  medium: 'rgba(230,168,23,0.06)',
  high: 'rgba(192,57,43,0.06)',
  info: 'rgba(59,130,246,0.06)',
}

export default function ReportCard({ title, value, emoji, level }: Props) {
  return (
    <View style={[styles.card, {
      borderLeftColor: levelColors[level],
      backgroundColor: levelBg[level]
    }]}>
      <View style={[styles.iconWrap, { backgroundColor: levelColors[level] + '18' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderLeftWidth: 3,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 22 },
  body: { flex: 1 },
  title: {
    fontSize: 11,
    color: '#8aaa8a',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    color: '#1a2e1a',
    fontWeight: '700',
    lineHeight: 20,
  },
})