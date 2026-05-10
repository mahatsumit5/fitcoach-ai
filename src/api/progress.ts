import { supabase } from "@/lib/supabase";

export type WorkoutDataPoint = {
  date:             string;
  duration_seconds: number;
  calories_burned:  number | null;
};

export type NutritionDataPoint = {
  date:      string;
  calories:  number;
  protein_g: number;
};

export async function getWorkoutHistory30Days(
  profileId: string
): Promise<WorkoutDataPoint[]> {
  const from = new Date();
  from.setDate(from.getDate() - 30);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select("started_at, duration_seconds, calories_burned")
    .eq("profile_id", profileId)
    .eq("completed", true)
    .gte("started_at", from.toISOString())
    .order("started_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    date:             row.started_at.split("T")[0],
    duration_seconds: row.duration_seconds ?? 0,
    calories_burned:  row.calories_burned,
  }));
}

export async function getNutrition7Days(
  profileId: string
): Promise<NutritionDataPoint[]> {
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("logged_at, calories, protein_g")
    .eq("profile_id", profileId)
    .gte("logged_at", from.toISOString())
    .order("logged_at", { ascending: true });

  if (error) throw error;

  // Group by day
  const grouped: Record<string, { calories: number; protein_g: number }> = {};
  for (const row of data ?? []) {
    const day = row.logged_at.split("T")[0];
    if (!grouped[day]) grouped[day] = { calories: 0, protein_g: 0 };
    grouped[day].calories  += row.calories;
    grouped[day].protein_g += row.protein_g;
  }

  return Object.entries(grouped).map(([date, totals]) => ({
    date,
    calories:  Math.round(totals.calories),
    protein_g: Math.round(totals.protein_g),
  }));
}

export async function getConsistency30Days(profileId: string): Promise<string[]> {
  const from = new Date();
  from.setDate(from.getDate() - 30);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select("started_at")
    .eq("profile_id", profileId)
    .eq("completed", true)
    .gte("started_at", from.toISOString());

  if (error) throw error;
  return (data ?? []).map((row) => row.started_at.split("T")[0]);
}
