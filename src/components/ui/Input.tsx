import React, { useState } from "react";
import {
  View, TextInput, Text,
  TouchableOpacity, type TextInputProps,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

interface InputProps extends TextInputProps {
  label?:            string;
  error?:            string;
  hint?:             string;
  leftIcon?:         React.ReactNode;
  rightIcon?:        React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?:       boolean;
}

export function Input({
  label, error, hint,
  leftIcon, rightIcon, onRightIconPress,
  isPassword = false,
  ...props
}: InputProps) {
  const { theme }  = useTheme();
  const [isFocused,    setIsFocused]    = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? theme.error
    : isFocused
    ? theme.inputFocused
    : theme.inputBorder;

  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label && (
        <Text style={{ fontSize: 15, fontWeight: "500", color: theme.textSecondary, marginLeft: 4 }}>
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection:   "row",
          alignItems:      "center",
          backgroundColor: theme.inputBg,
          borderWidth:     1,
          borderColor,
          borderRadius:    16,
          paddingHorizontal: 16,
          height:          56,
        }}
      >
        {leftIcon && (
          <View style={{ marginRight: 12, opacity: 0.6 }}>{leftIcon}</View>
        )}

        <TextInput
          style={{ flex: 1, fontSize: 17, color: theme.textPrimary }}
          placeholderTextColor={theme.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ marginLeft: 12 }}>
            {showPassword
              ? <EyeOff size={20} color={theme.textMuted} />
              : <Eye     size={20} color={theme.textMuted} />
            }
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={{ marginLeft: 12 }}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={{ fontSize: 14, color: theme.error, marginLeft: 4 }}>{error}</Text>
      ) : hint ? (
        <Text style={{ fontSize: 14, color: theme.textMuted, marginLeft: 4 }}>{hint}</Text>
      ) : null}
    </View>
  );
}
