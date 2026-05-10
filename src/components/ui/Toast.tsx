import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import {
  CheckCircle, XCircle, AlertTriangle, Info,
} from "lucide-react-native";
import { useUIStore } from "@/stores/uiStore";
import { useTheme }  from "@/hooks/useTheme";
import type { ToastType } from "@/types";

const ICON_MAP: Record<ToastType, any> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

export function Toast() {
  const { toastMessage, toastType } = useUIStore();
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue:         toastMessage ? 0 : -80,
        useNativeDriver: true,
        tension:         100,
        friction:        8,
      }),
      Animated.timing(opacity, {
        toValue:         toastMessage ? 1 : 0,
        duration:        200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toastMessage]);

  if (!toastMessage) return null;

  const colorMap: Record<ToastType, { bg: string; text: string; icon: string }> = {
    success: { bg: theme.successBg, text: theme.success,  icon: theme.success },
    error:   { bg: theme.errorBg,   text: theme.error,    icon: theme.error },
    warning: { bg: theme.warningBg, text: theme.warning,  icon: theme.warning },
    info:    { bg: theme.bgTertiary,text: theme.textPrimary, icon: theme.brand },
  };

  const { bg, text, icon } = colorMap[toastType];
  const Icon = ICON_MAP[toastType];

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        position:  "absolute",
        top:       56,
        left:      16,
        right:     16,
        zIndex:    9999,
      }}
    >
      <View
        style={{
          backgroundColor: bg,
          borderRadius:    16,
          paddingHorizontal: 16,
          paddingVertical:   12,
          flexDirection:   "row",
          alignItems:      "center",
          gap:             12,
          borderWidth:     0.5,
          borderColor:     icon,
        }}
      >
        <Icon size={20} color={icon} strokeWidth={2} />
        <Text style={{ color: text, flex: 1, fontSize: 15, fontWeight: "500" }}>
          {toastMessage}
        </Text>
      </View>
    </Animated.View>
  );
}
