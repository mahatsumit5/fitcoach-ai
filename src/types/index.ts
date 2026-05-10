import type { Database } from "./database";

// ─── Database row types ───────────────────────────────────────────────────────
export type Profile        = Database["public"]["Tables"]["profiles"]["Row"];
export type Exercise       = Database["public"]["Tables"]["exercises"]["Row"];
export type WorkoutSession = Database["public"]["Tables"]["workout_sessions"]["Row"];
export type NutritionLog   = Database["public"]["Tables"]["nutrition_logs"]["Row"];
export type AiMessage      = Database["public"]["Tables"]["ai_messages"]["Row"];
export type WaterLog       = Database["public"]["Tables"]["water_logs"]["Row"];

// ─── Domain enums ─────────────────────────────────────────────────────────────
export type FitnessGoal =
  | "lose_weight"
  | "build_muscle"
  | "improve_endurance"
  | "stay_active"
  | "increase_flexibility";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "legs"
  | "glutes"
  | "full_body"
  | "cardio";

// ─── Workout session types ────────────────────────────────────────────────────
export type SetLog = {
  set_number: number;
  reps: number;
  weight_kg: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion 1–10
};

export type ActiveExercise = {
  id: string;
  name: string;
  muscle_group: string;
  sets_planned: number;
  reps_planned: string;
  weight_kg: number;
  rest_seconds: number;
  sets_logged: SetLog[];
};

export type ActiveWorkoutSession = {
  id: string;
  name: string;
  startedAt: string;
  exercises: ActiveExercise[];
  completed: boolean;
};

// ─── AI / Claude types ────────────────────────────────────────────────────────
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type GeneratedWorkoutPlan = {
  plan_name: string;
  duration_weeks: number;
  days_per_week: number;
  weekly_schedule: {
    day: number;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      rest_seconds: number;
      notes: string;
    }[];
  }[];
  coach_notes: string;
};

export type GeneratedMealPlan = {
  meals: {
    name: string;
    time: string;
    foods: { item: string; portion: string; calories: number }[];
    total_calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }[];
  daily_totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  hydration_tip: string;
};

// ─── UI types ─────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning";

export type TabRoute =
  | "Dashboard"
  | "Workouts"
  | "Coach"
  | "Nutrition"
  | "Progress";
