import type { Profile } from "@/types";

export function buildMotivationalMessagePrompt(profile: Profile): string {
  const day = new Date().toLocaleDateString("en-AU", { weekday: "long" });
  return `Write a short motivational message for a fitness app user.

Context:
- Day: ${day}
- Goal: ${profile.fitness_goal ?? "general fitness"}
- Experience: ${profile.experience_level ?? "beginner"}
- Name: ${profile.display_name ?? "Athlete"}

Rules:
- Max 2 sentences
- Specific to their goal
- Energetic but not over the top
- Plain text only, no quotes or punctuation gimmicks`;
}

export function buildStreakMessagePrompt(streakDays: number): string {
  return `Write a 1-sentence congratulatory message for a user who has a ${streakDays}-day workout streak.
Be specific about the number. Keep it under 15 words. Plain text, no quotes.`;
}
