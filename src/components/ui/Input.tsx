import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error
    ? "border-red-500"
    : isFocused
    ? "border-brand-500"
    : "border-surface-border";

  return (
    <View className="w-full gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-gray-300 ml-1">{label}</Text>
      )}

      <View
        className={`flex-row items-center bg-surface-secondary border ${borderClass} rounded-2xl px-4 h-14`}
      >
        {leftIcon && (
          <View className="mr-3 opacity-60">{leftIcon}</View>
        )}

        <TextInput
          className="flex-1 text-base text-white"
          placeholderTextColor="#4b5563"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            className="ml-3"
          >
            <Text className="text-sm text-gray-400">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} className="ml-3 opacity-60">
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text className="text-sm text-red-400 ml-1">{error}</Text>
      ) : hint ? (
        <Text className="text-sm text-gray-500 ml-1">{hint}</Text>
      ) : null}
    </View>
  );
}
