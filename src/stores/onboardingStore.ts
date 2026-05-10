import { create } from "zustand";
import type { FitnessGoal, ExperienceLevel } from "@/types";

export type OnboardingData = {
  // Step 1 — Profile
  display_name: string;
  age: string;
  weight_kg: string;
  height_cm: string;
  // Step 2 — Goals
  fitness_goal: FitnessGoal | "";
  experience_level: ExperienceLevel | "";
  days_per_week: number;
  // Step 3 — Preferences
  equipment: string;
  dietary_prefs: string[];
  injuries: string[];
};

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const defaultData: OnboardingData = {
  display_name:     "",
  age:              "",
  weight_kg:        "",
  height_cm:        "",
  fitness_goal:     "",
  experience_level: "",
  days_per_week:    4,
  equipment:        "gym",
  dietary_prefs:    [],
  injuries:         [],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data:        defaultData,
  currentStep: 1,

  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  reset:    () => set({ data: defaultData, currentStep: 1 }),
}));
