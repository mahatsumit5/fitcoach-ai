import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  getIsDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "dark",

      setMode: (mode) => set({ mode }),

      getIsDark: () => {
        const { mode } = get();
        if (mode === "system") {
          return Appearance.getColorScheme() === "dark";
        }
        return mode === "dark";
      },
    }),
    {
      name:    "theme-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
