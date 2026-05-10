import type { Profile } from "@/types";

export const NUTRITION_SYSTEM_PROMPT = `You are FitCoach AI, a certified nutritionist and dietitian.
You create practical, achievable meal plans based on scientific principles.
Always respond with valid JSON only — no markdown, no preamble.
Use realistic, commonly available foods.
Never suggest anything that conflicts with stated dietary preferences or allergies.`;

export function buildMealPlanPrompt(
  profile: Profile,
  targetCalories: number
): string {
  return `Create a one-day meal plan for this person.

Profile:
- Goal: ${profile.fitness_goal ?? "general health"}
- Daily calorie target: ${targetCalories} kcal
- Dietary preferences: ${profile.dietary_prefs?.join(", ") || "none"}
- Injuries: ${profile.injuries?.join(", ") || "none"}

Respond ONLY with this JSON schema:
{
  "daily_target": {
    "calories": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number
  },
  "meals": [
    {
      "name": string,
      "time": string,
      "foods": [
        {
          "item": string,
          "portion": string,
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number
        }
      ],
      "total_calories": number,
      "total_protein_g": number,
      "total_carbs_g": number,
      "total_fat_g": number
    }
  ],
  "hydration_tip": string,
  "coach_note": string
}`;
}

export function buildMacroTargetPrompt(profile: Profile): string {
  const weight = profile.weight_kg ?? 75;
  return `Calculate personalised daily macro targets for this user.

Profile:
- Weight: ${weight}kg
- Goal: ${profile.fitness_goal ?? "general fitness"}
- Experience: ${profile.experience_level ?? "beginner"}
- Training days per week: ${profile.days_per_week ?? 4}

Respond ONLY with this JSON:
{
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "water_ml": number,
  "reasoning": string (1 sentence explaining the targets)
}`;
}

export function buildMealSuggestionPrompt(
  mealType: string,
  calorieTarget: number,
  preferences: string[]
): string {
  return `Suggest 3 ${mealType} options around ${calorieTarget} calories.
Dietary preferences: ${preferences.join(", ") || "none"}.

Respond ONLY with JSON:
{
  "suggestions": [
    {
      "name": string,
      "calories": number,
      "protein_g": number,
      "prep_minutes": number,
      "description": string (1 sentence)
    }
  ]
}`;
}
