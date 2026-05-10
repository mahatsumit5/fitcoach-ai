import { supabase } from "@/lib/supabase";
import type { WorkoutSession, ActiveWorkoutSession } from "@/types";

export async function saveWorkoutSession(
  profileId: string,
  session: ActiveWorkoutSession,
  durationSeconds: number
): Promise<WorkoutSession> {
  // 1. Insert the session
  const { data: saved, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      profile_id:       profileId,
      name:             session.name,
      duration_seconds: durationSeconds,
      completed:        true,
      started_at:       session.startedAt,
      completed_at:     new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  // 2. Insert all exercises
  if (session.exercises.length > 0) {
    const exerciseRows = session.exercises.map((ex, idx) => ({
      session_id:   saved.id,
      name:         ex.name,
      sets:         ex.sets_planned,
      reps:         parseInt(ex.reps_planned) || 0,
      weight_kg:    ex.weight_kg,
      rest_seconds: ex.rest_seconds,
      set_logs:     ex.sets_logged,
      sort_order:   idx,
    }));

    const { error: exError } = await supabase
      .from("session_exercises")
      .insert(exerciseRows);

    if (exError) throw exError;
  }

  return saved;
}

export async function getWorkoutHistory(
  profileId: string,
  limit = 20
): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("profile_id", profileId)
    .eq("completed", true)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getWorkoutSession(sessionId: string) {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`*, session_exercises(*)`)
    .eq("id", sessionId)
    .single();

  if (error) throw error;
  return data;
}

export async function getWeeklyStats(profileId: string) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select("id, duration_seconds, calories_burned, started_at")
    .eq("profile_id", profileId)
    .eq("completed", true)
    .gte("started_at", weekAgo.toISOString());

  if (error) throw error;

  const sessions = data ?? [];
  return {
    count:          sessions.length,
    totalMinutes:   Math.round(sessions.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0) / 60),
    totalCalories:  sessions.reduce((acc, s) => acc + (s.calories_burned ?? 0), 0),
  };
}
