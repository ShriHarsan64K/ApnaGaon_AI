// ============================================================
// SMART RULE ENGINE
// Features:
// 1. Parameter Extractor — pulls crop, symptom, location from text
// 2. Confidence Scoring — how sure are we about the match
// 3. Multi-signal matching — multiple keywords = higher confidence
// 4. Fallback chain — if low confidence, suggest calling KVK
// ============================================================

// ── CROP DICTIONARY ──
const CROPS = {
  wheat:   { hindi: 'Gehun',    keywords: ['wheat', 'gehun', 'gehu', 'gahu', 'गेहूं'] },
  cotton:  { hindi: 'Kapas',    keywords: ['cotton', 'kapas', 'karpas', 'कपास'] },
  rice:    { hindi: 'Chawal',   keywords: ['rice', 'paddy', 'chawal', 'dhan', 'dhaan', 'चावल', 'धान'] },
  soybean: { hindi: 'Soyabean', keywords: ['soybean', 'soya', 'soyabean', 'सोयाबीन'] },
  tomato:  { hindi: 'Tamatar',  keywords: ['tomato', 'tamatar', 'tomat', 'टमाटर'] },
  onion:   { hindi: 'Pyaaz',    keywords: ['onion', 'pyaaz', 'piyaz', 'kanda', 'प्याज'] },
  maize:   { hindi: 'Makka',    keywords: ['maize', 'corn', 'makka', 'makai', 'मक्का'] },
  sugarcane: { hindi: 'Ganna',  keywords: ['sugarcane', 'ganna', 'gana', 'गन्ना'] },
}

// ── SYMPTOM DICTIONARY ──
const SYMPTOMS = {
  yellow_leaves: {
    hindi: 'peele patte',
    keywords: ['yellow', 'pale', 'yellowing', 'chlorosis', 'light green', 'peela', 'peele', 'pila', 'pile', 'पीले', 'पत्ते पीले'],
    weight: 3,
  },
  pests: {
    hindi: 'keede',
    keywords: ['pest', 'insect', 'bug', 'worm', 'caterpillar', 'aphid', 'borer', 'mite', 'fly', 'keeda', 'keede', 'kida', 'कीड़े', 'कीट'],
    weight: 3,
  },
  wilting: {
    hindi: 'sukh jana',
    keywords: ['wilt', 'dry', 'drought', 'droop', 'dead', 'dying', 'sukha', 'sukh', 'mura', 'सूखना', 'मुरझाना'],
    weight: 3,
  },
  disease: {
    hindi: 'rog',
    keywords: ['spot', 'fungus', 'blight', 'rust', 'mold', 'rot', 'lesion', 'infection', 'rog', 'bimari', 'रोग', 'बीमारी'],
    weight: 2,
  },
  no_yield: {
    hindi: 'daane nahi',
    keywords: ['no fruit', 'no grain', 'poor yield', 'low yield', 'not flower', 'daane nahi', 'phal nahi', 'फल नहीं', 'दाने नहीं'],
    weight: 2,
  },
  overwatering: {
    hindi: 'zyada paani',
    keywords: ['overwater', 'too much water', 'waterlog', 'soggy', 'zyada paani', 'zyada sinchai', 'ज़्यादा पानी'],
    weight: 2,
  },
  nutrient: {
    hindi: 'poshan ki kami',
    keywords: ['nutrient', 'deficiency', 'nitrogen', 'phosphorus', 'potassium', 'zinc', 'kami', 'कमी'],
    weight: 2,
  },
}

// ── RULES DATABASE ──
const RULES = {
  wheat: {
    yellow_leaves: { hindi: 'Gehun mein peele patte nitrogen ki kami se hote hain. Urea spray karo — 2% concentration, 200 litre paani mein. Kharcha ₹80/acre. Subah ya shaam ko spray karo.', cost: 80, urgency: 'medium', action: 'Urea spray' },
    pests:         { hindi: 'Gehun mein keede ke liye Chlorpyrifos 2ml/litre paani mein spray karo. Kharcha ₹100/acre. Subah spray karo.', cost: 100, urgency: 'high', action: 'Chlorpyrifos spray' },
    wilting:       { hindi: 'Gehun sukh rahi hai — turant sinchai karo. 2 ghante drip irrigation karo.', cost: 0, urgency: 'high', action: 'Sinchai' },
    disease:       { hindi: 'Gehun mein rog ke liye Propiconazole spray karo — 1ml/litre paani. Kharcha ₹120/acre.', cost: 120, urgency: 'high', action: 'Propiconazole spray' },
    nutrient:      { hindi: 'Gehun mein poshan ki kami hai. DAP fertilizer dalo — 50kg/acre. Kharcha ₹600.', cost: 600, urgency: 'medium', action: 'DAP fertilizer' },
  },
  cotton: {
    yellow_leaves: { hindi: 'Kapas mein peele patte leafhopper keede ki wajah se hote hain. Imidacloprid 100ml/acre spray karo. Kharcha ₹120.', cost: 120, urgency: 'high', action: 'Imidacloprid spray' },
    pests:         { hindi: 'Kapas mein bollworm ke liye Chlorantraniliprole spray karo. Kharcha ₹200/acre. Shaam ko spray karo.', cost: 200, urgency: 'high', action: 'Chlorantraniliprole spray' },
    wilting:       { hindi: 'Kapas sukh rahi hai — drip irrigation se 3 ghante paani do. Kal dobara check karo.', cost: 0, urgency: 'high', action: 'Drip irrigation' },
    disease:       { hindi: 'Kapas mein viral rog ke liye infected paudhe hata do. Imidacloprid 0.5ml/litre spray karo. Kharcha ₹90/acre.', cost: 90, urgency: 'high', action: 'Remove + spray' },
  },
  rice: {
    yellow_leaves: { hindi: 'Chawal mein peele patte zinc ki kami se hote hain. Zinc Sulphate 25kg/hectare dalo. Kharcha ₹150.', cost: 150, urgency: 'medium', action: 'Zinc Sulphate' },
    pests:         { hindi: 'Chawal mein stem borer ke liye Cartap Hydrochloride spray karo. Kharcha ₹120/acre.', cost: 120, urgency: 'high', action: 'Cartap spray' },
    wilting:       { hindi: 'Chawal ke khet mein 5cm paani rehna chahiye. Turant sinchai karo.', cost: 0, urgency: 'high', action: 'Sinchai' },
    disease:       { hindi: 'Chawal mein blast rog ke liye Tricyclazole spray karo — 0.6g/litre paani. Kharcha ₹130/acre.', cost: 130, urgency: 'high', action: 'Tricyclazole spray' },
  },
  tomato: {
    yellow_leaves: { hindi: 'Tamatar mein peele patte magnesium ki kami se hote hain. Micronutrient spray karo. Kharcha ₹90/acre.', cost: 90, urgency: 'medium', action: 'Micronutrient spray' },
    pests:         { hindi: 'Tamatar mein whitefly ke liye Yellow sticky traps lagao aur Thiamethoxam spray karo. Kharcha ₹110/acre.', cost: 110, urgency: 'high', action: 'Thiamethoxam spray' },
    disease:       { hindi: 'Tamatar mein early blight ke liye Mancozeb spray karo — 2.5g/litre paani. Kharcha ₹80/acre.', cost: 80, urgency: 'high', action: 'Mancozeb spray' },
    wilting:       { hindi: 'Tamatar sukh raha hai — drip irrigation karo. Mulching bhi karo paani bachane ke liye.', cost: 0, urgency: 'high', action: 'Drip + Mulching' },
  },
  soybean: {
    yellow_leaves: { hindi: 'Soyabean mein peele patte iron ya manganese ki kami se hote hain. Chelated micronutrient spray karo. Kharcha ₹100/acre.', cost: 100, urgency: 'medium', action: 'Micronutrient spray' },
    pests:         { hindi: 'Soyabean mein girdle beetle ke liye Quinalphos spray karo. Kharcha ₹130/acre. Subah spray karo.', cost: 130, urgency: 'high', action: 'Quinalphos spray' },
    disease:       { hindi: 'Soyabean mein rust ke liye Hexaconazole spray karo. Kharcha ₹150/acre.', cost: 150, urgency: 'high', action: 'Hexaconazole spray' },
  },
  onion: {
    yellow_leaves: { hindi: 'Pyaaz mein peele patte thrips ki wajah se hote hain. Spinosad spray karo. Kharcha ₹180/acre.', cost: 180, urgency: 'high', action: 'Spinosad spray' },
    disease:       { hindi: 'Pyaaz mein purple blotch rog ke liye Iprodione spray karo. Kharcha ₹140/acre.', cost: 140, urgency: 'high', action: 'Iprodione spray' },
    pests:         { hindi: 'Pyaaz mein thrips ke liye neem oil spray karo pehle. Zyada ho to Imidacloprid spray karo.', cost: 80, urgency: 'medium', action: 'Neem oil spray' },
  },
  general: {
    yellow_leaves: { hindi: 'Patte peele ho rahe hain — nitrogen ki kami ho sakti hai. Urea spray karo ya nazdiki Krishi Kendra se soil test karwao. Kharcha ₹80/acre.', cost: 80, urgency: 'medium', action: 'Urea spray ya soil test' },
    pests:         { hindi: 'Keede ke liye Neem oil spray karo — 5ml/litre paani. Yeh organic hai aur safe bhi. Kharcha ₹50/acre.', cost: 50, urgency: 'medium', action: 'Neem oil spray' },
    wilting:       { hindi: 'Fasal sukh rahi hai — turant sinchai karo. Subah ya shaam ko paani do, dopahar mein nahi.', cost: 0, urgency: 'high', action: 'Sinchai' },
    disease:       { hindi: 'Rog ke liye fungicide spray karo. Nazdiki krishi dukaan se advice lo. Kharcha ₹100-150/acre.', cost: 120, urgency: 'high', action: 'Fungicide spray' },
    no_yield:      { hindi: 'Daane nahi aa rahe — boron spray karo ya madhumakhi palana shuru karo pollination ke liye. Kharcha ₹60/acre.', cost: 60, urgency: 'medium', action: 'Boron spray' },
    nutrient:      { hindi: 'Poshan ki kami hai. NPK fertilizer dalo — 50kg/acre. Soil test karwao sahi diagnosis ke liye.', cost: 400, urgency: 'medium', action: 'NPK fertilizer' },
    overwatering:  { hindi: 'Zyada paani se fasal kharab ho rahi hai. Sinchai band karo. Drainage banao khet mein.', cost: 0, urgency: 'high', action: 'Drainage banana' },
    default:       { hindi: 'Apne nazdiki Krishi Vigyan Kendra mein jaiye ya Kisan Call Centre pe call karein: 1800-180-1551. Woh bilkul free advice denge.', cost: 0, urgency: 'low', action: 'Contact KVK' },
  },
}

// ── URGENCY LEVELS ──
const URGENCY_HINDI = {
  high:   '🔴 Aaj hi karo',
  medium: '🟡 Jald karo',
  low:    '🟢 Jab ho sake',
}


// ════════════════════════════════════════════
// PARAMETER EXTRACTOR
// Takes raw text and extracts structured params
// ════════════════════════════════════════════

function extractParameters(text) {
  const lower = text.toLowerCase()
  const words = lower.split(/\s+/)

  const params = {
    crop: null,
    cropHindi: null,
    symptom: null,
    symptomHindi: null,
    location: null,
    cropConfidence: 0,
    symptomConfidence: 0,
  }

  // ── Extract Crop ──
  for (const [cropKey, cropData] of Object.entries(CROPS)) {
    let matchCount = 0
    for (const keyword of cropData.keywords) {
      if (lower.includes(keyword)) matchCount++
    }
    if (matchCount > 0) {
      const confidence = Math.min(100, matchCount * 40)
      if (confidence > params.cropConfidence) {
        params.crop = cropKey
        params.cropHindi = cropData.hindi
        params.cropConfidence = confidence
      }
    }
  }

  // ── Extract Symptom ──
  let bestSymptom = null
  let bestSymptomScore = 0

  for (const [symptomKey, symptomData] of Object.entries(SYMPTOMS)) {
    let matchCount = 0
    for (const keyword of symptomData.keywords) {
      if (lower.includes(keyword)) matchCount++
    }
    if (matchCount > 0) {
      const score = matchCount * symptomData.weight * 20
      if (score > bestSymptomScore) {
        bestSymptom = symptomKey
        bestSymptomScore = score
        params.symptomConfidence = Math.min(100, score)
      }
    }
  }

  params.symptom = bestSymptom
  params.symptomHindi = bestSymptom ? SYMPTOMS[bestSymptom].hindi : null

  return params
}


// ════════════════════════════════════════════
// CONFIDENCE SCORER
// Returns 0-100 overall confidence
// ════════════════════════════════════════════

function calculateConfidence(params) {
  const { cropConfidence, symptomConfidence, crop, symptom } = params

  // No matches at all
  if (!crop && !symptom) return 0

  // Both matched
  if (crop && symptom) {
    const base = (cropConfidence + symptomConfidence) / 2
    // Bonus if crop has specific rule (not just general)
    const hasSpecificRule = RULES[crop] && RULES[crop][symptom]
    return Math.min(100, base + (hasSpecificRule ? 15 : 0))
  }

  // Only symptom matched — use general crop rules
  if (!crop && symptom) return Math.min(60, symptomConfidence * 0.7)

  // Only crop matched — can't give specific advice
  if (crop && !symptom) return Math.min(40, cropConfidence * 0.5)

  return 0
}


// ════════════════════════════════════════════
// MAIN RULE ENGINE FUNCTION
// ════════════════════════════════════════════

function getRuleEngineResponse(text) {
  // Step 1 — Extract parameters
  const params = extractParameters(text)

  // Step 2 — Calculate confidence
  const confidence = calculateConfidence(params)

  // Step 3 — Get the matching rule
  const cropKey = params.crop || 'general'
  const symptomKey = params.symptom || 'default'

  const cropRules = RULES[cropKey] || RULES.general
  const rule = cropRules[symptomKey]
             || RULES.general[symptomKey]
             || RULES.general.default

  // Step 4 — Build response based on confidence level
  let responseText = ''

  if (confidence >= 70) {
    // HIGH confidence — give full specific advice
    responseText = rule.hindi
  } else if (confidence >= 40) {
    // MEDIUM confidence — give advice with caveat
    responseText = `${rule.hindi} (Note: Pakka diagnosis ke liye nazdiki Krishi Kendra mein bhi jaiye.)`
  } else {
    // LOW confidence — be honest
    responseText = `Aapki samasya samajhna mushkil ho raha hai. Kisan Call Centre pe call karein: 1800-180-1551 — woh free advice denge. ${rule.hindi}`
  }

  return {
    response: responseText,
    source: 'rule_engine',

    // Extracted parameters
    extractedCrop: params.crop,
    extractedCropHindi: params.cropHindi,
    extractedSymptom: params.symptom,
    extractedSymptomHindi: params.symptomHindi,

    // Confidence
    confidence,
    confidenceLabel: confidence >= 70 ? 'HIGH' : confidence >= 40 ? 'MEDIUM' : 'LOW',

    // Rule details
    action: rule.action,
    cost: rule.cost,
    urgency: rule.urgency,
    urgencyHindi: URGENCY_HINDI[rule.urgency] || URGENCY_HINDI.low,
  }
}


// ════════════════════════════════════════════
// VOICE + TAP HYBRID INPUT NORMALIZER
// Normalizes both tap-selected options and
// free-form voice text into the same format
// ════════════════════════════════════════════

function normalizeInput(input) {
  // If input is from tap selection (structured object)
  if (typeof input === 'object' && input.crop && input.problem) {
    return `${input.crop} ${input.problem} ${input.location || ''}`
  }

  // If input is a string (from voice or text)
  if (typeof input === 'string') {
    return input.trim()
  }

  return ''
}


// Export everything
module.exports = {
  getRuleEngineResponse,
  extractParameters,
  calculateConfidence,
  normalizeInput,
  CROPS,
  SYMPTOMS,
}