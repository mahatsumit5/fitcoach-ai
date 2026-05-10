import { supabase } from "@/lib/supabase";
import type { NutritionLog } from "@/types";

export async function logMeal(
  profileId: string,
  meal: Omit<NutritionLog, "id" | "profile_id">
): Promise<NutritionLog> {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert({ ...meal, profile_id: profileId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTodayNutrition(profileId: string): Promise<NutritionLog[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("profile_id", profileId)
    .gte("logged_at", today.toISOString())
    .order("logged_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getNutritionHistory(
  profileId: string,
  days = 7
): Promise<NutritionLog[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);

  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("profile_id", profileId)
    .gte("logged_at", from.toISOString())
    .order("logged_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function deleteMeal(mealId: string): Promise<void> {
  const { error } = await supabase
    .from("nutrition_logs")
    .delete()
    .eq("id", mealId);
  if (error) throw error;
}

export async function logWater(
  profileId: string,
  amount_ml: number
): Promise<void> {
  const { error } = await supabase
    .from("water_logs")
    .insert({ profile_id: profileId, amount_ml });
  if (error) throw error;
}

export async function getTodayWater(profileId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("water_logs")
    .select("amount_ml")
    .eq("profile_id", profileId)
    .gte("logged_at", today.toISOString());

  if (error) throw error;
  return (data ?? []).reduce((acc, row) => acc + row.amount_ml, 0);
}
