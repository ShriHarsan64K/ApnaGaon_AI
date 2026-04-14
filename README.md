# 🌾 ApnaGaon AI
### Har Khet Mein Ek Jaankaar

> Voice-first AI assistant for India's 93 million marginal farmers. Speaks Hindi. Works offline. Zero literacy required.

[![#ROVOTINKERQUEST](https://img.shields.io/badge/ROVO-TinkerQuest%2026-green)](https://unstop.com)
[![React Native](https://img.shields.io/badge/React%20Native-Android-blue)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org)
[![NVIDIA](https://img.shields.io/badge/AI-NVIDIA%20%2B%20Groq-orange)](https://nvidia.com)

---

## 🎯 The Problem

India has **93 million marginal farmers** earning **₹27/day** making life-critical decisions entirely alone — which pesticide to use, which mandi to sell at, which government scheme they qualify for. No expert to call. No reliable internet. No solution ever built for them.

**ApnaGaon AI is that solution.**

---

## 📱 What We Built

A React Native Android app where farmers tap one icon and speak in Hindi. The AI responds in spoken Hindi with actionable advice. Works fully offline via a smart fallback chain.

### 🌿 Fasal Salah — Crop Advisory
- Tap or speak in Hindi to describe crop problem
- Weather auto-fetched from IMD
- Smart parameter extractor with confidence scoring (HIGH / MEDIUM / LOW)
- One clear action with cost — every time
- Works fully offline via rule engine

### 💰 Mandi Bhav — Price Tracker
- Live prices from 20+ mandis via AgMarkNet API
- Net profit calculated after transport cost
- 150km distance filter — only realistic options shown
- Offline database fallback (5 states, 6 crops, 25+ mandis)
- Impact shown in days of income: *"₹5,850 zyaada — 217 din ki extra kamai"*

### 📋 Sarkari Yojana — Scheme Navigator
- 4 tap questions → matches 8 government schemes
- PM-KISAN ₹6,000 · PMFBY · KCC · PM-KUSUM · and more
- Required documents listed per scheme
- Fraud warning built-in on every result
- Works fully offline

---

## 🤖 AI Fallback Chain

```
NVIDIA API → Groq → Smart Rule Engine → Offline Cache
```

The farmer **never sees which layer runs**. They always get an answer.

| Layer | When | Response Time |
|-------|------|--------------|
| ⚡ NVIDIA Llama 3.1 | Online + good signal | ~2.4 seconds |
| 🔄 Groq Llama 3.1 | Fallback / slow signal | ~3-5 seconds |
| 📋 Rule Engine | No internet | Instant |
| 💾 SQLite Cache | Zero connectivity | Instant |

### Confidence Scoring
- **HIGH (70+)** → Specific advice with cost
- **MEDIUM (40-70)** → Advice + verify at local KVK
- **LOW (<40)** → Honest "call 1800-180-1551"

---

## 📊 Impact

| Intervention | Value/farmer/year |
|---|---|
| Early disease detection | ₹4,200 |
| Better mandi price | ₹8,000 |
| PM-KISAN enrollment | ₹6,000 |
| Wrong pesticide avoided | ₹2,400 |
| **Total** | **₹26,000+** |

Average farmer income: ₹9,855/year → **ApnaGaon AI = 2.6× impact**

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Android) |
| Backend | Node.js + Express |
| Primary AI | NVIDIA Llama 3.1 8B Instruct |
| Fallback AI | Groq Llama 3.1 8B Instant (Free) |
| Mandi Data | AgMarkNet API (data.gov.in) |
| Weather | IMD / OpenWeatherMap |
| Voice Output | React Native TTS (Hindi hi-IN) |
| Offline DB | SQLite + JSON rule engine |

---

## 📁 Project Structure

```
ApnaGaon-AI/
├── mobile/                    # React Native Android App
│   ├── src/
│   │   ├── screens/           # HomeScreen, CropScreen, MandiScreen, SchemeScreen
│   │   ├── components/        # MicButton, VoiceResponse, ReportCard, OfflineBanner
│   │   ├── services/          # api.ts, voice.ts, aiFallback.ts
│   │   ├── constants/         # colors, api, layout, fonts
│   │   └── navigation/        # AppNavigator
│   └── android/               # Android build configs
│
├── backend/                   # Node.js + Express API
│   ├── routes/
│   │   ├── advisory.js        # Crop advisory endpoint
│   │   ├── mandi.js           # Mandi price endpoint
│   │   └── schemes.js         # Government schemes endpoint
│   ├── services/
│   │   ├── nvidia.js          # NVIDIA API integration
│   │   ├── openai.js          # Groq API integration
│   │   ├── ruleEngine.js      # Smart offline rule engine
│   │   ├── agmarknet.js       # Live mandi prices + offline fallback
│   │   └── imd.js             # Weather service
│   └── data/
│       ├── schemes.json       # 8 government schemes
│       └── mandis_offline.json # Offline mandi database
└── docs/                      # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio + Android SDK
- Java 17

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your API keys (see .env.example)

npm run dev
# Backend runs on http://localhost:3000
```

### Mobile Setup

```bash
cd mobile
npm install

# Update API URL
# Edit mobile/src/constants/api.ts
# Set BASE_URL to your laptop's IP address

# Run on Android device
npx react-native run-android
```

### Environment Variables

```env
# backend/.env
NVIDIA_API_KEY=your_nvidia_api_key
GROQ_API_KEY=your_groq_api_key
WEATHER_API_KEY=your_openweathermap_key
AGMARKNET_API_KEY=your_agmarknet_key
PORT=3000
```

---

## 🔌 API Endpoints

```
GET  /health                  → Server status + AI chain info

POST /api/advisory            → Crop advisory
     { crop, problem, location }

POST /api/mandi               → Mandi prices
     { crop, quantity, state }

POST /api/schemes             → Scheme matching
     { landAcres, cropType, state, hasBankAccount }
```

---

## 🎬 Demo

> *Demo video link coming soon*

**Demo flow:**
1. Open app → tap 🌿 Fasal Salah → select Gehun → Patte peele → get Hindi advice in 2.4s
2. Turn WiFi OFF → same question → rule engine responds instantly
3. Tap 💰 Mandi Bhav → Tamatar → 4 quintal → Nagpur APMC best → impact line shown
4. Tap 📋 Sarkari Yojana → 4 questions → PM-KISAN ₹6,000 matched

---

## 👥 Team — The Hidden Variables

| Name | Role | Contact |
|---|---|---|
| **Shri Harsan** | Team Leader · Mobile & Frontend | 
| **Aarna Chauhan** | Backend & AI Integration |
| **Pratyay Pal** | Architecture & AI Strategy | 

---

## 🏆 Hackathon

Built for **ROVO TinkerQuest '26** on Unstop
**#ROVOTINKERQUEST**

---

## 📄 License

MIT License — built for farmers, open for the world.

---

*Har Khet Mein Ek Jaankaar. 🌾*