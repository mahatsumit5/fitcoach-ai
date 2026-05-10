import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "bg-green-900/60",  text: "text-green-400" },
  warning: { bg: "bg-yellow-900/60", text: "text-yellow-400" },
  error:   { bg: "bg-red-900/60",    text: "text-red-400" },
  info:    { bg: "bg-blue-900/60",   text: "text-blue-400" },
  neutral: { bg: "bg-surface-tertiary", text: "text-gray-400" },
};

export function Badge({ label, variant = "neutral", size = "sm" }: BadgeProps) {
  const { bg, text } = variantStyles[variant];
  const padding = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`${bg} rounded-full ${padding} self-start`}>
      <Text className={`${text} ${fontSize} font-medium`}>{label}</Text>
    </View>
  );
}
