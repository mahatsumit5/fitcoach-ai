import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type MacroTargets = {
  calories:  number;
  protein_g: number;
  carbs_g:   number;
  fat_g:     number;
  water_ml:  number;
};

export type MealEntry = {
  id:        string;
  meal_name: string;
  calories:  number;
  protein_g: number;
  carbs_g:   number;
  fat_g:     number;
  logged_at: string;
};

export type WaterEntry = {
  id:        string;
  amount_ml: number;
  logged_at: string;
};

interface NutritionState {
  todayMeals:    MealEntry[];
  todayWater:    WaterEntry[];
  macroTargets:  MacroTargets;

  // Totals (derived)
  getTotals: () => { calories: number; protein_g: number; carbs_g: number; fat_g: number };
  getTotalWater: () => number;

  // Actions
  addMeal:         (meal: Omit<MealEntry, "id" | "logged_at">) => void;
  removeMeal:      (id: string) => void;
  addWater:        (amount_ml: number) => void;
  setMacroTargets: (targets: MacroTargets) => void;
  resetDay:        () => void;
}

const DEFAULT_TARGETS: MacroTargets = {
  calories:  2000,
  protein_g: 150,
  carbs_g:   200,
  fat_g:     65,
  water_ml:  2500,
};

const isToday = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString();

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      todayMeals:   [],
      todayWater:   [],
      macroTargets: DEFAULT_TARGETS,

      getTotals: () => {
        const meals = get().todayMeals.filter((m) => isToday(m.logged_at));
        return meals.reduce(
          (acc, m) => ({
            calories:  acc.calories  + m.calories,
            protein_g: acc.protein_g + m.protein_g,
            carbs_g:   acc.carbs_g   + m.carbs_g,
            fat_g:     acc.fat_g     + m.fat_g,
          }),
          { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
        );
      },

      getTotalWater: () =>
        get()
          .todayWater
          .filter((w) => isToday(w.logged_at))
          .reduce((acc, w) => acc + w.amount_ml, 0),

      addMeal: (meal) =>
        set((state) => ({
          todayMeals: [
            ...state.todayMeals,
            {
              ...meal,
              id:        `meal_${Date.now()}`,
              logged_at: new Date().toISOString(),
            },
          ],
        })),

      removeMeal: (id) =>
        set((state) => ({
          todayMeals: state.todayMeals.filter((m) => m.id !== id),
        })),

      addWater: (amount_ml) =>
        set((state) => ({
          todayWater: [
            ...state.todayWater,
            {
              id:        `water_${Date.now()}`,
              amount_ml,
              logged_at: new Date().toISOString(),
            },
          ],
        })),

      setMacroTargets: (targets) => set({ macroTargets: targets }),

      resetDay: () => set({ todayMeals: [], todayWater: [] }),
    }),
    {
      name:    "nutrition-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
