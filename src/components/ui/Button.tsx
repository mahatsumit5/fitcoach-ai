import React from "react";
import {
  TouchableOpacity, Text, ActivityIndicator,
  View, type TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  label:      string;
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant   = "primary",
  size      = "md",
  loading   = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle = {
    primary:   { backgroundColor: theme.brand,        borderColor: theme.brand,        borderWidth: 1 },
    secondary: { backgroundColor: theme.bgTertiary,   borderColor: theme.border,       borderWidth: 1 },
    outline:   { backgroundColor: "transparent",      borderColor: theme.brand,        borderWidth: 1.5 },
    ghost:     { backgroundColor: "transparent",      borderColor: "transparent",      borderWidth: 1 },
    danger:    { backgroundColor: "#dc2626",           borderColor: "#dc2626",          borderWidth: 1 },
  }[variant];

  const textColor = {
    primary:   "#ffffff",
    secondary: theme.textPrimary,
    outline:   theme.brand,
    ghost:     theme.brandLight,
    danger:    "#ffffff",
  }[variant];

  const paddingStyle = {
    sm: { paddingHorizontal: 16, paddingVertical: 9,  borderRadius: 14 },
    md: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 18 },
    lg: { paddingHorizontal: 32, paddingVertical: 17, borderRadius: 18 },
  }[size];

  const fontSize = { sm: 15, md: 17, lg: 18 }[size];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        {
          flexDirection:  "row",
          alignItems:     "center",
          justifyContent: "center",
          ...containerStyle,
          ...paddingStyle,
          opacity:   isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? theme.brand : "#fff"}
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {leftIcon}
          <Text style={{ color: textColor, fontSize, fontWeight: "600" }}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
