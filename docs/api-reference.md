# ApnaGaon AI — API Reference

## Base URL
http://localhost:3000 (development)

## Endpoints

### POST /api/advisory
Crop advisory with AI fallback chain.

Request:
{
  "crop": "wheat",
  "problem": "yellow leaves",
  "location": "Wardha"
}

Response:
{
  "response": "Hindi advice text",
  "source": "nvidia | groq | rule_engine",
  "crop": "wheat",
  "weatherInfo": "Weather crop action",
  "timestamp": "ISO date"
}

---

### POST /api/mandi
Mandi price comparison with net earnings.

Request:
{
  "crop": "tomato",
  "quantity": "4",
  "state": "Maharashtra"
}

Response:
{
  "mandis": [...],
  "best": { mandi details },
  "sellAdvice": "Hindi advice",
  "impactLine": "₹X din ki extra kamai"
}

---

### POST /api/schemes
Government scheme eligibility matching.

Request:
{
  "landAcres": "1.5",
  "cropType": "wheat",
  "state": "Maharashtra",
  "hasBankAccount": true
}

Response:
{
  "matched": [...schemes],
  "count": 8,
  "totalCashBenefit": 6000,
  "impactLine": "₹6000 milne waale hain",
  "fraudWarning": "..."
}

---

### GET /health
Returns server status.
