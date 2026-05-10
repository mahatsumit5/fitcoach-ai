import { useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { darkTheme, lightTheme, type AppTheme } from "@/lib/theme";

export function useTheme(): { theme: AppTheme; isDark: boolean } {
  const { mode }   = useThemeStore();
  const systemScheme = useColorScheme();

  const isDark =
    mode === "dark"
      ? true
      : mode === "light"
      ? false
      : systemScheme === "dark";

  const theme = isDark ? darkTheme : lightTheme;
  return { theme, isDark };
}
