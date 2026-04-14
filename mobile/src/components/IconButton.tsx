import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { colors } from '../constants/colors'

type Props = {
  emoji: string
  label: string
  onPress: () => void
  size?: 'large' | 'small'
}

export default function IconButton({
  emoji,
  label,
  onPress,
  size = 'large',
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, size === 'small' && styles.small]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.emoji, size === 'small' && styles.emojiSmall]}>
        {emoji}
      </Text>
      <Text style={[styles.label, size === 'small' && styles.labelSmall]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 8,
    elevation: 3,
  },
  small: {
    padding: 16,
    borderRadius: 14,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emojiSmall: {
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  labelSmall: {
    fontSize: 12,
  },
})