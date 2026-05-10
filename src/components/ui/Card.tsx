import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Padding = "none" | "sm" | "md" | "lg";
type Variant = "default" | "elevated" | "outlined";

interface CardProps extends ViewProps {
  children:  React.ReactNode;
  padding?:  Padding;
  variant?:  Variant;
}

const paddingMap: Record<Padding, number> = {
  none: 0, sm: 12, md: 16, lg: 24,
};

export function Card({
  children,
  padding = "md",
  variant = "default",
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const bg = {
    default:  theme.bgCard,
    elevated: theme.bgSecondary,
    outlined: "transparent",
  }[variant];

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius:    24,
          borderWidth:     0.5,
          borderColor:     theme.border,
          padding:         paddingMap[padding],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
