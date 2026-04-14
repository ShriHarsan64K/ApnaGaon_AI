export function buildCropPrompt(crop: string, problem: string, weather: string, location: string): string {
  return `Tu ek Indian kisan ka salahkar hai. Sirf Hindi mein jawab do. 3 sentences se zyada mat likho.

Kisan ki jankari:
- Fasal: ${crop}
- Dikkat: ${problem}
- Location: ${location}
- Kal ka mausam: ${weather}

Ek clear action bolo. Cost batao agar dawai chahiye.`
}

export function buildMandiPrompt(crop: string, quantity: string, bestMandi: string, price: number): string {
  return `Tu ek mandi price advisor hai. Sirf Hindi mein 2 sentences mein jawab do.

Fasal: ${crop}
Quantity: ${quantity} quintal
Sabse achha mandi: ${bestMandi} at ₹${price}/kg

Farmer ko seedha batao kahan aur kab bechna chahiye.`
}

export function buildSchemePrompt(land: string, crop: string, state: string): string {
  return `Tu ek sarkari yojana advisor hai. Sirf Hindi mein jawab do.

Kisan ki jankari:
- Zameen: ${land}
- Fasal: ${crop}  
- State: ${state}

PM-KISAN ke baare mein 2 sentences mein batao aur documents ki list do.`
}