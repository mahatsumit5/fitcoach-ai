import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useUIStore } from "@/stores/uiStore";
import type { ToastType } from "@/types";

const toastStyles: Record<ToastType, { bg: string; text: string; icon: string }> = {
  success: { bg: "bg-green-900/90 border-green-700",  text: "text-green-300", icon: "✓" },
  error:   { bg: "bg-red-900/90 border-red-700",      text: "text-red-300",   icon: "✕" },
  warning: { bg: "bg-yellow-900/90 border-yellow-700",text: "text-yellow-300",icon: "⚠" },
  info:    { bg: "bg-surface-tertiary border-surface-border", text: "text-gray-300", icon: "i" },
};

export function Toast() {
  const { toastMessage, toastType, hideToast } = useUIStore();
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  const { bg, text, icon } = toastStyles[toastType];

  return (
    <Animated.View
      style={{ transform: [{ translateY }], opacity, zIndex: 9999 }}
      className="absolute top-14 left-4 right-4"
    >
      <View className={`${bg} border rounded-2xl px-4 py-3 flex-row items-center gap-3`}>
        <View className="w-6 h-6 rounded-full bg-white/10 items-center justify-center">
          <Text className={`${text} text-xs font-bold`}>{icon}</Text>
        </View>
        <Text className={`${text} flex-1 text-sm font-medium`}>{toastMessage}</Text>
      </View>
    </Animated.View>
  );
}
