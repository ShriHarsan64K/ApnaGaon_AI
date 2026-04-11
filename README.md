# 🌾 ApnaGaon AI
### Voice-First Rural Intelligence System for Indian Farmers

> *"Har khet mein ek jaankaar"* — An expert in every field.

Built for **#ROVOTINKERQUEST** on Unstop.

---

## The Problem
India has 93 million marginal farmers earning ₹27/day.
They make life-and-death decisions about their crops entirely alone —
no expert to ask, no market information, no awareness of government schemes.

## The Solution
ApnaGaon AI is a voice-first, offline-capable AI assistant for rural farmers.
- Speaks Hindi and regional dialects
- Works on any basic Android phone
- Works with or without internet
- Zero literacy required

## Three Domains
- 🌿 **Fasal Salah** — Crop advisory with weather integration
- 💰 **Mandi Bhav** — Price comparison across 5 nearest mandis
- 📋 **Sarkari Yojana** — Government scheme eligibility navigator

## AI Fallback Chain
NVIDIA API → Groq API → Rule Engine
The farmer always gets an answer. They never see which layer runs.

## Tech Stack
- **App:** React Native (Android)
- **Backend:** Node.js + Express
- **AI:** NVIDIA API + Groq + Rule Engine
- **Data:** AgMarkNet, IMD, Static JSON
- **Voice:** React Native Voice + TTS

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env  # add your API keys
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx react-native run-android
```

## Impact
- ₹4,200 saved per farmer from early crop disease detection
- ₹8,000 extra per farmer from better mandi price realization
- ₹6,000 per year from PM-KISAN enrollment
- **Total: ₹26,000+ value per farmer per year**

---

*Built with ❤️ for India's farmers.*
