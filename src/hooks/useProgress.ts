import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import {
  getWorkoutHistory30Days,
  getNutrition7Days,
  getConsistency30Days,
} from "@/api/progress";

export function useProgressData() {
  const { user } = useAuthStore();

  const workoutsQuery = useQuery({
    queryKey: ["progress-workouts", user?.id],
    queryFn:  () => getWorkoutHistory30Days(user!.id),
    enabled:  !!user?.id,
    staleTime: 1000 * 60 * 10,
  });

  const nutritionQuery = useQuery({
    queryKey: ["progress-nutrition", user?.id],
    queryFn:  () => getNutrition7Days(user!.id),
    enabled:  !!user?.id,
    staleTime: 1000 * 60 * 10,
  });

  const consistencyQuery = useQuery({
    queryKey: ["progress-consistency", user?.id],
    queryFn:  () => getConsistency30Days(user!.id),
    enabled:  !!user?.id,
    staleTime: 1000 * 60 * 10,
  });

  // Compute streak from consistency data
  const streak = (() => {
    const dates = new Set(consistencyQuery.data ?? []);
    let count   = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (dates.has(key)) count++;
      else if (i > 0) break;
    }
    return count;
  })();

  const totalWorkouts30d = workoutsQuery.data?.length ?? 0;
  const totalMinutes30d  = Math.round(
    (workoutsQuery.data ?? []).reduce((acc, w) => acc + w.duration_seconds, 0) / 60
  );

  return {
    workouts:        workoutsQuery.data ?? [],
    nutrition:       nutritionQuery.data ?? [],
    workedOutDates:  consistencyQuery.data ?? [],
    isLoading:       workoutsQuery.isLoading || consistencyQuery.isLoading,
    streak,
    totalWorkouts30d,
    totalMinutes30d,
  };
}
