import React from "react";
import { View, Text } from "react-native";
import { formatDuration } from "@/utils/formatting";

interface WorkoutTimerProps {
  seconds: number;
  size?: "sm" | "lg";
}

export function WorkoutTimer({ seconds, size = "lg" }: WorkoutTimerProps) {
  const isLarge = size === "lg";

  return (
    <View className="items-center">
      <Text
        style={{
          fontVariant: ["tabular-nums"],
          fontSize:    isLarge ? 48 : 22,
          fontWeight:  "600",
          color:       "#22c55e",
          letterSpacing: 2,
        }}
      >
        {formatDuration(seconds)}
      </Text>
      {isLarge && (
        <Text className="text-gray-500 text-sm mt-1">elapsed</Text>
      )}
    </View>
  );
}
