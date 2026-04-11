# ApnaGaon AI — System Architecture

## Overview
Voice-first AI assistant for Indian farmers. Works offline.
Hindi + regional dialects. Zero literacy required.

## Tech Stack
- Frontend: React Native (Android)
- Backend: Node.js + Express
- AI Chain: NVIDIA → Groq → Rule Engine
- Voice: React Native Voice + TTS
- Data: AgMarkNet, IMD, Static JSON

## AI Fallback Chain
1. NVIDIA API (primary — best quality)
2. Groq API (fallback — fast and free)
3. Rule Engine (offline — instant)

## Three Domains
1. Crop Report & Advisory
2. Mandi Price Tracker
3. Scheme Navigator

## Connectivity Modes
- Online: NVIDIA/Groq + live data
- Low signal: Groq + cached data
- Offline: Rule engine + SQLite cache

## API Endpoints
- POST /api/advisory
- POST /api/mandi
- POST /api/schemes
- POST /api/voice/process
- GET  /health
