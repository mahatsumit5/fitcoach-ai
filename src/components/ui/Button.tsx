import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-brand-500 border border-brand-500",
  secondary: "bg-surface-tertiary border border-surface-border",
  outline:   "bg-transparent border border-brand-500",
  ghost:     "bg-transparent border border-transparent",
  danger:    "bg-red-600 border border-red-600",
};

const labelVariants: Record<Variant, string> = {
  primary:   "text-white font-semibold",
  secondary: "text-white font-semibold",
  outline:   "text-brand-500 font-semibold",
  ghost:     "text-brand-400 font-medium",
  danger:    "text-white font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 rounded-xl",
  md: "px-6 py-3.5 rounded-2xl",
  lg: "px-8 py-4 rounded-2xl",
};

const labelSizes: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === "outline" || variant === "ghost" ? "#22c55e" : "#ffffff";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      className={[
        "flex-row items-center justify-center",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "self-start",
        isDisabled ? "opacity-50" : "opacity-100",
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {leftIcon}
          <Text className={`${labelVariants[variant]} ${labelSizes[size]}`}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
