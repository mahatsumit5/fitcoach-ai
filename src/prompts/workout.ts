import type { Profile } from "@/types";

export const WORKOUT_SYSTEM_PROMPT = `You are FitCoach AI, an expert personal trainer with 15+ years of experience.
You create safe, effective, science-backed workout programmes.
Always respond with valid JSON only — no markdown, no preamble, no explanation outside the JSON.
Never hallucinate exercises. Use only standard, well-known gym exercises.
Factor in any injuries or limitations the user mentions.`;

export function buildWorkoutPlanPrompt(profile: Profile): string {
  return `Generate a personalised weekly workout plan for this user.

User profile:
- Name: ${profile.display_name ?? "Athlete"}
- Age: ${profile.age ?? "unknown"}
- Weight: ${profile.weight_kg ? `${profile.weight_kg}kg` : "unknown"}
- Height: ${profile.height_cm ? `${profile.height_cm}cm` : "unknown"}
- Goal: ${profile.fitness_goal ?? "general fitness"}
- Experience: ${profile.experience_level ?? "beginner"}
- Available ${profile.days_per_week ?? 4} days per week
- Equipment: ${profile.equipment ?? "gym"}
- Injuries/limitations: ${profile.injuries?.join(", ") || "none"}

Respond ONLY with this exact JSON schema:
{
  "plan_name": string,
  "duration_weeks": number,
  "days_per_week": number,
  "overview": string (2 sentences max),
  "weekly_schedule": [
    {
      "day": number,
      "name": string,
      "focus": string,
      "estimated_duration_minutes": number,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": string,
          "rest_seconds": number,
          "notes": string
        }
      ]
    }
  ],
  "coach_notes": string (2-3 sentences of personalised advice)
}`;
}

export function buildExerciseExplanationPrompt(
  exerciseName: string,
  level: string
): string {
  return `Explain how to perform the "${exerciseName}" exercise for a ${level} level person.

Rules:
- Max 120 words
- Second person ("you")
- Cover: starting position, movement, common mistakes
- No markdown, plain text only`;
}

export function buildWorkoutAdjustmentPrompt(
  profile: Profile,
  feedback: string
): string {
  return `A fitness app user needs their workout adjusted.

User profile:
- Goal: ${profile.fitness_goal}
- Experience: ${profile.experience_level}
- Equipment: ${profile.equipment}

User feedback: "${feedback}"

Respond with a JSON object:
{
  "assessment": string (1 sentence acknowledging the feedback),
  "adjustments": string[] (2-4 specific changes to make),
  "motivation": string (1 encouraging sentence)
}`;
}
