const RULES = {
  crop: {
    wheat: {
      yellow_leaves: {
        hindi: 'Gehun mein pili pattiyan nitrogen ki kami se hoti hain. Urea spray karo — 2% concentration, 200 litre paani mein. Kharcha ₹80/acre. Subah ya shaam ko spray karo.',
        action: 'Urea spray',
        cost: 80,
        urgency: 'medium'
      },
      pests: {
        hindi: 'Gehun mein keede ke liye Chlorpyrifos 2ml/litre paani mein spray karo. Kharcha ₹100/acre. Subah spray karo.',
        action: 'Chlorpyrifos spray',
        cost: 100,
        urgency: 'high'
      },
      wilting: {
        hindi: 'Gehun sukh rahi hai — turant sinchai karo. 2 ghante drip irrigation karo. Agar baarish nahi aayi to kal dobara karo.',
        action: 'Irrigation',
        cost: 0,
        urgency: 'high'
      },
      disease: {
        hindi: 'Gehun mein rog ke liye Propiconazole spray karo — 1ml/litre paani. Kharcha ₹120/acre. Shaam ko spray karo.',
        action: 'Propiconazole spray',
        cost: 120,
        urgency: 'high'
      }
    },
    cotton: {
      yellow_leaves: {
        hindi: 'Kapas mein peele patte leafhopper keede ki wajah se ho sakte hain. Imidacloprid 100ml/acre spray karo — 200 litre paani mein. Kharcha ₹120.',
        action: 'Imidacloprid spray',
        cost: 120,
        urgency: 'high'
      },
      pests: {
        hindi: 'Kapas mein bollworm ke liye Chlorantraniliprole spray karo. Kharcha ₹200/acre. Shaam ko spray karo.',
        action: 'Chlorantraniliprole spray',
        cost: 200,
        urgency: 'high'
      },
      wilting: {
        hindi: 'Kapas sukh rahi hai — mitti mein naami check karo. Drip irrigation se 3 ghante paani do. Kal dobara check karo.',
        action: 'Drip irrigation',
        cost: 0,
        urgency: 'high'
      },
      disease: {
        hindi: 'Kapas mein viral rog ke liye infected paudhe hata do. Keetnashak spray karo — Imidacloprid 0.5ml/litre. Kharcha ₹90/acre.',
        action: 'Remove infected plants + spray',
        cost: 90,
        urgency: 'high'
      }
    },
    rice: {
      yellow_leaves: {
        hindi: 'Chawal mein peele patte zinc ki kami se hote hain. Zinc Sulphate 25kg/hectare dalo. Kharcha ₹150.',
        action: 'Zinc Sulphate application',
        cost: 150,
        urgency: 'medium'
      },
      pests: {
        hindi: 'Chawal mein stem borer ke liye Cartap Hydrochloride spray karo. Kharcha ₹120/acre.',
        action: 'Cartap spray',
        cost: 120,
        urgency: 'high'
      },
      wilting: {
        hindi: 'Chawal ke khet mein paani ka level check karo — 5cm paani rehna chahiye. Turant sinchai karo.',
        action: 'Irrigation',
        cost: 0,
        urgency: 'high'
      },
      disease: {
        hindi: 'Chawal mein blast rog ke liye Tricyclazole spray karo — 0.6g/litre paani. Kharcha ₹130/acre.',
        action: 'Tricyclazole spray',
        cost: 130,
        urgency: 'high'
      }
    },
    tomato: {
      yellow_leaves: {
        hindi: 'Tamatar mein peele patte magnesium ya iron ki kami se hote hain. Micronutrient spray karo. Kharcha ₹90/acre.',
        action: 'Micronutrient spray',
        cost: 90,
        urgency: 'medium'
      },
      pests: {
        hindi: 'Tamatar mein whitefly ke liye Yellow sticky traps lagao aur Thiamethoxam spray karo. Kharcha ₹110/acre.',
        action: 'Thiamethoxam spray',
        cost: 110,
        urgency: 'high'
      },
      disease: {
        hindi: 'Tamatar mein early blight ke liye Mancozeb spray karo — 2.5g/litre paani. Kharcha ₹80/acre.',
        action: 'Mancozeb spray',
        cost: 80,
        urgency: 'high'
      }
    },
    soybean: {
      yellow_leaves: {
        hindi: 'Soyabean mein peele patte iron ya manganese ki kami se hote hain. Chelated micronutrient spray karo. Kharcha ₹100/acre.',
        action: 'Micronutrient spray',
        cost: 100,
        urgency: 'medium'
      },
      pests: {
        hindi: 'Soyabean mein girdle beetle ke liye Quinalphos spray karo. Kharcha ₹130/acre. Subah spray karo.',
        action: 'Quinalphos spray',
        cost: 130,
        urgency: 'high'
      }
    },
    general: {
      yellow_leaves: {
        hindi: 'Patte peele ho rahe hain — yeh nitrogen ki kami ho sakti hai. Urea spray karo ya nazdiki Krishi Kendra se soil test karwao.',
        action: 'Urea spray or soil test',
        cost: 80,
        urgency: 'medium'
      },
      pests: {
        hindi: 'Keede ke liye Neem oil spray karo — 5ml/litre paani. Yeh organic hai aur safe hai. Kharcha ₹50/acre.',
        action: 'Neem oil spray',
        cost: 50,
        urgency: 'medium'
      },
      wilting: {
        hindi: 'Fasal sukh rahi hai — turant sinchai karo. Subah ya shaam ko paani do, dopahar mein nahi.',
        action: 'Irrigation',
        cost: 0,
        urgency: 'high'
      },
      disease: {
        hindi: 'Fasal mein rog ke liye fungicide spray karo. Nazdiki krishi dukaan se advice lo. Kharcha ₹100-150/acre.',
        action: 'Fungicide spray',
        cost: 120,
        urgency: 'high'
      },
      no_yield: {
        hindi: 'Daane nahi aa rahe — yeh pollination ki kami ho sakti hai. Khet mein madhumakhi palana shuru karo ya boron spray karo. Kharcha ₹60/acre.',
        action: 'Boron spray',
        cost: 60,
        urgency: 'medium'
      },
      default: {
        hindi: 'Apne nazdiki Krishi Vigyan Kendra mein jaiye ya Kisan Call Centre pe call karein: 1800-180-1551. Woh bilkul free advice denge.',
        action: 'Contact KVK',
        cost: 0,
        urgency: 'low'
      }
    }
  }
}

const SYMPTOM_KEYWORDS = {
  yellow_leaves: ['yellow', 'pale', 'yellowing', 'chlorosis', 'light green', 'peela', 'pili'],
  pests: ['pest', 'insect', 'bug', 'worm', 'caterpillar', 'aphid', 'borer', 'mite', 'keeda', 'keede'],
  wilting: ['wilt', 'dry', 'drought', 'drooping', 'dead', 'brown', 'dying', 'sukha', 'mura'],
  no_yield: ['no fruit', 'no grain', 'poor yield', 'low yield', 'not flowering', 'daane nahi'],
  disease: ['spot', 'fungus', 'blight', 'rust', 'mold', 'rot', 'lesion', 'rog', 'bimari']
}

const CROP_KEYWORDS = {
  wheat: ['wheat', 'gehun', 'gehu', 'gahu'],
  cotton: ['cotton', 'kapas', 'karpas', 'kapas'],
  rice: ['rice', 'paddy', 'chawal', 'dhan', 'dhaan'],
  soybean: ['soybean', 'soya', 'soyabean', 'soybean'],
  tomato: ['tomato', 'tamatar', 'tomat'],
  onion: ['onion', 'pyaaz', 'piyaz', 'kanda']
}

function detectSymptom(text) {
  const lower = text.toLowerCase()
  for (const [symptom, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return symptom
  }
  return 'default'
}

function detectCrop(text) {
  const lower = text.toLowerCase()
  for (const [crop, keywords] of Object.entries(CROP_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return crop
  }
  return 'general'
}

function getRuleEngineResponse(englishText) {
  const crop = detectCrop(englishText)
  const symptom = detectSymptom(englishText)

  const cropRules = RULES.crop[crop] || RULES.crop.general
  const rule = cropRules[symptom] || RULES.crop.general[symptom] || RULES.crop.general.default

  return {
    response: rule.hindi,
    source: 'rule_engine',
    crop,
    symptom,
    action: rule.action,
    cost: rule.cost,
    urgency: rule.urgency
  }
}

module.exports = { getRuleEngineResponse, detectCrop, detectSymptom }