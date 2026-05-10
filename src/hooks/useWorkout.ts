import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore }   from "@/stores/authStore";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useUIStore }     from "@/stores/uiStore";
import { saveWorkoutSession, getWorkoutHistory, getWeeklyStats } from "@/api/workouts";

export function useWorkoutHistory() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["workouts", user?.id],
    queryFn:  () => getWorkoutHistory(user!.id),
    enabled:  !!user?.id,
  });
}

export function useWeeklyStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["weekly-stats", user?.id],
    queryFn:  () => getWeeklyStats(user!.id),
    enabled:  !!user?.id,
  });
}

export function useActiveWorkout() {
  const { user }    = useAuthStore();
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();
  const {
    activeSession,
    elapsedSeconds,
    startSession,
    logSet,
    updateSet,
    removeSet,
    addExercise,
    removeExercise,
    tickTimer,
    completeSession,
    abandonSession,
  } = useWorkoutStore();

  // Timer interval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSession && !activeSession.completed) {
      timerRef.current = setInterval(tickTimer, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.id]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const session = completeSession();
      if (!session || !user) throw new Error("No active session");
      return saveWorkoutSession(user.id, session, elapsedSeconds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["weekly-stats", user?.id] });
      showToast("Workout saved!", "success");
    },
    onError: () => {
      showToast("Failed to save workout. Try again.", "error");
    },
  });

  return {
    activeSession,
    elapsedSeconds,
    startSession,
    logSet,
    updateSet,
    removeSet,
    addExercise,
    removeExercise,
    finishWorkout: saveMutation.mutateAsync,
    abandonSession,
    isSaving: saveMutation.isPending,
  };
}
