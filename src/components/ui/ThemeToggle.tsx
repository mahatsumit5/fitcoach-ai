import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon, Smartphone } from "lucide-react-native";
import { useThemeStore, type ThemeMode } from "@/stores/themeStore";
import { useTheme } from "@/hooks/useTheme";

const OPTIONS: { mode: ThemeMode; label: string; Icon: any }[] = [
  { mode: "light",  label: "Light",  Icon: Sun },
  { mode: "dark",   label: "Dark",   Icon: Moon },
  { mode: "system", label: "System", Icon: Smartphone },
];

export function ThemeToggle() {
  const { mode, setMode } = useThemeStore();
  const { theme }         = useTheme();

  return (
    <View
      style={{
        flexDirection:   "row",
        backgroundColor: theme.bgTertiary,
        borderRadius:    14,
        padding:         4,
        borderWidth:     0.5,
        borderColor:     theme.border,
      }}
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => {
        const active = mode === m;
        return (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={{
              flex:            1,
              flexDirection:   "row",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             6,
              paddingVertical: 9,
              borderRadius:    10,
              backgroundColor: active ? theme.brand : "transparent",
            }}
          >
            <Icon size={16} color={active ? "#fff" : theme.textMuted} strokeWidth={2} />
            <Text
              style={{
                fontSize:   14,
                fontWeight: active ? "600" : "400",
                color:      active ? "#fff" : theme.textMuted,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
