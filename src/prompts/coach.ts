import type { Profile } from "@/types";

export function buildCoachSystemPrompt(profile: Profile): string {
  return `You are FitCoach AI, a warm, knowledgeable personal trainer and wellness coach.

About this user:
- Name: ${profile.display_name ?? "there"}
- Goal: ${profile.fitness_goal ?? "general fitness"}
- Experience: ${profile.experience_level ?? "beginner"}
- Equipment: ${profile.equipment ?? "gym"}
- Injuries: ${profile.injuries?.join(", ") || "none"}

Your communication style:
- Encouraging but honest
- Concise — keep responses under 150 words unless explaining an exercise or plan
- Use the user's name occasionally
- Never give medical advice — refer to a doctor for injuries
- Always be positive and motivating
- If asked about nutrition, give practical food-first advice
- If asked for a workout plan or meal plan, generate structured JSON

Available context types you can help with:
- Workout planning and exercise form
- Nutrition and meal planning  
- Progress analysis and motivation
- Recovery and rest day advice
- General fitness questions`;
}

export function buildProgressSummaryPrompt(
  profile: Profile,
  stats: {
    workoutsCompleted: number;
    workoutsPlanned: number;
    avgDurationMinutes: number;
    weightChangeKg: number | null;
  }
): string {
  return `Analyse this user's recent fitness progress and provide coaching feedback.

User:
- Goal: ${profile.fitness_goal}
- Experience: ${profile.experience_level}

Last 30 days:
- Workouts completed: ${stats.workoutsCompleted} of ${stats.workoutsPlanned} planned
- Average session: ${stats.avgDurationMinutes} minutes
- Weight change: ${stats.weightChangeKg !== null ? `${stats.weightChangeKg > 0 ? "+" : ""}${stats.weightChangeKg}kg` : "not tracked"}

Respond ONLY with this JSON:
{
  "headline": string (one punchy sentence summarising their month),
  "wins": string[] (2-3 genuine positives, specific not generic),
  "focus_areas": string[] (1-2 honest improvement areas),
  "next_week_tip": string (one concrete, actionable tip for next week),
  "motivation": string (one personalised motivational sentence)
}`;
}

export function buildRecoveryAdvicePrompt(
  profile: Profile,
  recentWorkouts: number
): string {
  return `This user has completed ${recentWorkouts} workouts in the last 7 days.
Goal: ${profile.fitness_goal}. Experience: ${profile.experience_level}.

Give brief recovery advice in plain text (no JSON, max 80 words).
Cover: sleep, nutrition timing, and whether they should rest or train tomorrow.`;
}

export const SUGGESTED_PROMPTS = [
  "Generate a workout plan for me",
  "What should I eat today?",
  "How do I do a deadlift correctly?",
  "Am I overtraining?",
  "Give me a high-protein breakfast idea",
  "How can I improve my squat?",
  "What's a good pre-workout meal?",
  "Help me lose fat while keeping muscle",
];
