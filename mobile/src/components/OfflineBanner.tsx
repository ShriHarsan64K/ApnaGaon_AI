import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  mode: 'online' | 'low' | 'offline'
}

export default function OfflineBanner({ mode }: Props) {
  if (mode === 'online') return null

  const config = {
    low: { bg: '#e6a817', text: '🔶 Kam signal — cached data use ho raha hai' },
    offline: { bg: '#c0392b', text: '📡 Internet nahi — offline mode mein hai' },
  }

  return (
    <View style={[styles.banner, { backgroundColor: config[mode].bg }]}>
      <Text style={styles.text}>{config[mode].text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})