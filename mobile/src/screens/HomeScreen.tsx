import React, { useEffect } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView,
  StatusBar, TouchableOpacity, ScrollView,
  Image, Dimensions
} from 'react-native'
import OfflineBanner from '../components/OfflineBanner'
import { setupTTS } from '../services/voice'

const { width, height } = Dimensions.get('window')
const LOGO = require('../../assets/logo.jpg')

export default function HomeScreen({ navigation }: any) {
  useEffect(() => {
    setupTTS()
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <OfflineBanner mode="online" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* NAV */}
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <Image source={LOGO} style={styles.navLogo} resizeMode="contain" />
            <View>
              <Text style={styles.navName}>ApnaGaon AI</Text>
              <Text style={styles.navSub}>KISAN SAATHI</Text>
            </View>
          </View>
          <View style={styles.langPill}>
            <Text style={styles.langText}>🌐 Hindi</Text>
          </View>
        </View>

        {/* TAGS */}
        <View style={styles.tagRow}>
          {['AWAAZ PAHLE', 'OFFLINE', 'KISAN KE LIYE'].map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <Text style={styles.tagDot}>•</Text>}
              <Text style={styles.tagText}>{t}</Text>
            </React.Fragment>
          ))}
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroH1}>
              {'Samjhdaari\nse '}
              <Text style={styles.heroGreen}>behtar{'\n'}fasal.</Text>
            </Text>
            <Text style={styles.heroBody}>
              Awaaz mein poochho, Hindi mein jawab paao.{'\n'}
              Internet ho ya na ho — hamesha kaam karega.
            </Text>

            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('Crop')}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaMic}>🎤</Text>
              <Text style={styles.ctaText}>ApnaGaon AI se poochho</Text>
            </TouchableOpacity>

            <View style={styles.trustRow}>
              <Text style={styles.trustText}>🛡️ Offline</Text>
              <Text style={styles.trustSep}>•</Text>
              <Text style={styles.trustText}>Hindi mein</Text>
              <Text style={styles.trustSep}>•</Text>
              <Text style={styles.trustText}>Free</Text>
            </View>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.heroImgWrap}>
              <Image source={LOGO} style={styles.heroImg} resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* SECTION */}
        <Text style={styles.sectionLabel}>KYA JAANNA HAI AAPKO?</Text>

        {/* 3 CARDS */}
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, { borderTopColor: '#4a7c4a' }]}
            onPress={() => navigation.navigate('Crop')}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#eaf3e0' }]}>
              <Text style={styles.cardIconText}>🌱</Text>
            </View>
            <Text style={styles.cardTitle}>Fasal{'\n'}Salah</Text>
            <Text style={styles.cardDesc}>Crop ki samasya — clear jawab</Text>
            <Text style={styles.cardEmoji}>🌿</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { borderTopColor: '#2d7a2d' }]}
            onPress={() => navigation.navigate('Mandi')}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#e0ede8' }]}>
              <Text style={styles.cardIconText}>💰</Text>
            </View>
            <Text style={styles.cardTitle}>Mandi{'\n'}Bhav</Text>
            <Text style={styles.cardDesc}>5 mandion ka bhav</Text>
            <Text style={styles.cardEmoji}>🏪</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { borderTopColor: '#1a5c1a' }]}
            onPress={() => navigation.navigate('Scheme')}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#e8f0e0' }]}>
              <Text style={styles.cardIconText}>📋</Text>
            </View>
            <Text style={styles.cardTitle}>Sarkari{'\n'}Yojana</Text>
            <Text style={styles.cardDesc}>4 sawaal — yojana milti</Text>
            <Text style={styles.cardEmoji}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footerBox}>
          <Text style={styles.footerLeaf}>🌿</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.footerTitle}>Aapki awaaz. Hamara AI.</Text>
            <Text style={styles.footerSub}>Har roz behtar faisle.</Text>
          </View>
        </View>

        {/* AI CHAIN */}
        <View style={styles.chainWrap}>
          <Text style={styles.chainText}>⚡ NVIDIA → Groq → Rule Engine</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const CARD_W = (width - 52) / 3

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },

  // NAV
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navLogo: { width: 36, height: 36, borderRadius: 8 },
  navName: { fontSize: 16, fontWeight: '800', color: '#2d5a2d' },
  navSub: { fontSize: 9, color: '#8aaa8a', letterSpacing: 2 },
  langPill: {
    borderWidth: 1, borderColor: '#d4e4d4',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  langText: { fontSize: 12, fontWeight: '600', color: '#4a6a4a' },

  // TAGS
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  tagText: { fontSize: 10, fontWeight: '700', color: '#5a8a5a', letterSpacing: 1 },
  tagDot: { fontSize: 10, color: '#8aaa8a' },

  // HERO
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 10,
  },
  heroLeft: { flex: 1 },
  heroH1: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1a3a1a',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroGreen: { color: '#4a7c4a' },
  heroBody: {
    fontSize: 12,
    color: '#5a7a5a',
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a7c4a',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    elevation: 3,
  },
  ctaMic: { fontSize: 15 },
  ctaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { fontSize: 11, color: '#6a8a6a', fontWeight: '500' },
  trustSep: { fontSize: 11, color: '#aacaaa' },

  heroRight: { width: 100, paddingTop: 4 },
  heroImgWrap: {
    width: 100, height: 100,
    borderRadius: 14,
    backgroundColor: '#f0f7f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImg: { width: 96, height: 96 },

  // SECTION
  sectionLabel: {
    fontSize: 10, fontWeight: '700',
    color: '#8aaa8a', letterSpacing: 2,
    marginBottom: 10,
  },

  // CARDS
  cardRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0eae0',
    borderTopWidth: 3,
    padding: 12,
    minHeight: 160,
  },
  cardIcon: {
    width: 38, height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIconText: { fontSize: 18 },
  cardTitle: {
    fontSize: 12, fontWeight: '800',
    color: '#1a3a1a', marginBottom: 4,
    lineHeight: 16,
  },
  cardDesc: { fontSize: 10, color: '#7a9a7a', lineHeight: 14, flex: 1 },
  cardEmoji: { fontSize: 22, marginTop: 8 },

  // FOOTER
  footerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7f0',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0eae0',
  },
  footerLeaf: { fontSize: 28 },
  footerTitle: { fontSize: 15, fontWeight: '800', color: '#1a3a1a' },
  footerSub: { fontSize: 12, color: '#5a7a5a', marginTop: 2 },

  // AI CHAIN
  chainWrap: {
    backgroundColor: '#f5f7f2',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#d4e4d4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  chainText: { fontSize: 11, color: '#4a7c4a', fontWeight: '700' },
})