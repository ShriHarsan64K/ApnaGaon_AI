import React, { useState, useEffect, useRef } from 'react'
import {
  TouchableOpacity, Text, StyleSheet,
  View, Animated, Alert
} from 'react-native'
import { colors } from '../constants/colors'
import { requestMicPermission } from '../services/voice'

type Props = {
  label?: string
  onVoiceResult?: (text: string) => void
}

export default function MicButton({ label, onVoiceResult }: Props) {
  const [isListening, setIsListening] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const barAnims = useRef([1,2,3,4,5].map(() => new Animated.Value(8))).current

  useEffect(() => {
    if (isListening) {
      // Pulse ring animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start()

      // Wave bar animations
      barAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 24 + 8,
              duration: 200 + i * 80,
              useNativeDriver: false
            }),
            Animated.timing(anim, {
              toValue: 8,
              duration: 200 + i * 80,
              useNativeDriver: false
            }),
          ])
        ).start()
      })
    } else {
      pulseAnim.stopAnimation()
      pulseAnim.setValue(1)
      barAnims.forEach(a => { a.stopAnimation(); a.setValue(8) })
    }
  }, [isListening])

  const handlePress = async () => {
    const hasPermission = await requestMicPermission()

    if (!hasPermission) {
      Alert.alert(
        '⚠️ Permission Chahiye',
        'Settings → Apps → ApnaGaon AI → Permissions → Microphone → Allow',
        [{ text: 'OK', style: 'default' }]
      )
      return
    }

    setIsListening(true)

    // Auto stop after 4 seconds
    setTimeout(() => {
      setIsListening(false)
      // For now simulate a voice result
      if (onVoiceResult) {
        onVoiceResult('Patte peele ho rahe hain')
      }
    }, 4000)
  }

  const handleStop = () => {
    setIsListening(false)
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[
        styles.pulseRing,
        { transform: [{ scale: pulseAnim }], opacity: isListening ? 0.3 : 0 }
      ]} />

      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonListening]}
        onPress={isListening ? handleStop : handlePress}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>{isListening ? '⏹' : '🎤'}</Text>
        <Text style={styles.label}>
          {isListening ? 'Tap karein rokne ke liye' : label || 'Bolne ke liye tap karein'}
        </Text>
      </TouchableOpacity>

      {isListening && (
        <View style={styles.waveBars}>
          {barAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[styles.bar, { height: anim }]}
            />
          ))}
        </View>
      )}

      {!isListening && (
        <Text style={styles.hint}>Tap karke bolein — Hindi mein</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    top: 0,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 5,
    width: '100%',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonListening: {
    backgroundColor: '#c0392b',
    shadowColor: '#c0392b',
  },
  icon: { fontSize: 22 },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  waveBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
    height: 36,
  },
  bar: {
    width: 5,
    backgroundColor: colors.primary,
    borderRadius: 3,
    minHeight: 8,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
})