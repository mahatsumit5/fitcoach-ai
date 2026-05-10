import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { clamp } from "@/utils/formatting";

const QUICK_AMOUNTS = [200, 250, 330, 500];

interface WaterTrackerProps {
  currentMl: number;
  targetMl:  number;
  onAdd:     (amount: number) => void;
}

export function WaterTracker({ currentMl, targetMl, onAdd }: WaterTrackerProps) {
  const pct    = clamp(currentMl / targetMl, 0, 1);
  const cups   = Math.round(currentMl / 250);
  const totalCups = Math.round(targetMl / 250);

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl p-4 gap-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white font-semibold text-base">Water</Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            {Math.round(currentMl)}ml of {Math.round(targetMl)}ml
          </Text>
        </View>
        <Text style={{ fontSize: 28 }}>💧</Text>
      </View>

      {/* Cup visualiser */}
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: totalCups }).map((_, i) => (
          <View
            key={i}
            className={`w-8 h-8 rounded-xl items-center justify-center ${
              i < cups ? "bg-blue-500" : "bg-surface-tertiary"
            }`}
          >
            <Text style={{ fontSize: 14 }}>
              {i < cups ? "💧" : "○"}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <View
          style={{
            width:           `${pct * 100}%`,
            height:          "100%",
            backgroundColor: "#3b82f6",
            borderRadius:    999,
          }}
        />
      </View>

      {/* Quick add buttons */}
      <View className="flex-row gap-2">
        {QUICK_AMOUNTS.map((ml) => (
          <TouchableOpacity
            key={ml}
            onPress={() => onAdd(ml)}
            className="flex-1 bg-surface-secondary border border-surface-border rounded-2xl py-2.5 items-center"
          >
            <Text className="text-blue-400 font-semibold text-sm">+{ml}</Text>
            <Text className="text-gray-600 text-xs">ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
