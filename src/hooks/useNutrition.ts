import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore }      from "@/stores/authStore";
import { useNutritionStore } from "@/stores/nutritionStore";
import { useUIStore }        from "@/stores/uiStore";
import {
  logMeal, getTodayNutrition, deleteMeal,
  logWater, getTodayWater,
} from "@/api/nutrition";

export function useNutrition() {
  const { user }      = useAuthStore();
  const { showToast } = useUIStore();
  const { addMeal: addLocal, removeMeal: removeLocal, addWater: addLocalWater } = useNutritionStore();
  const queryClient   = useQueryClient();

  const todayQuery = useQuery({
    queryKey: ["nutrition-today", user?.id],
    queryFn:  () => getTodayNutrition(user!.id),
    enabled:  !!user?.id,
  });

  const waterQuery = useQuery({
    queryKey: ["water-today", user?.id],
    queryFn:  () => getTodayWater(user!.id),
    enabled:  !!user?.id,
  });

  const logMealMutation = useMutation({
    mutationFn: async (meal: {
      meal_name: string;
      calories:  number;
      protein_g: number;
      carbs_g:   number;
      fat_g:     number;
    }) => {
      // Optimistic local update
      addLocal(meal);
      if (user) {
        return logMeal(user.id, { ...meal, logged_at: new Date().toISOString() });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-today", user?.id] });
      showToast("Meal logged!", "success");
    },
    onError: () => showToast("Failed to log meal.", "error"),
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      removeLocal(mealId);
      return deleteMeal(mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-today", user?.id] });
    },
    onError: () => showToast("Failed to remove meal.", "error"),
  });

  const logWaterMutation = useMutation({
    mutationFn: async (amount_ml: number) => {
      addLocalWater(amount_ml);
      if (user) return logWater(user.id, amount_ml);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-today", user?.id] });
    },
  });

  return {
    meals:       todayQuery.data ?? [],
    isLoading:   todayQuery.isLoading,
    waterMl:     waterQuery.data ?? 0,
    logMeal:     logMealMutation.mutateAsync,
    isLogging:   logMealMutation.isPending,
    deleteMeal:  deleteMealMutation.mutateAsync,
    logWater:    logWaterMutation.mutateAsync,
  };
}
