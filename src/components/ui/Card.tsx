import React from "react";
import { View, type ViewProps } from "react-native";

type Padding = "none" | "sm" | "md" | "lg";
type Variant = "default" | "elevated" | "outlined";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: Padding;
  variant?: Variant;
}

const paddingMap: Record<Padding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
};

const variantMap: Record<Variant, string> = {
  default:  "bg-surface-card border border-surface-border",
  elevated: "bg-surface-secondary border border-surface-border",
  outlined: "bg-transparent border border-surface-border",
};

export function Card({
  children,
  padding = "md",
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  return (
    <View
      className={`rounded-3xl ${variantMap[variant]} ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
