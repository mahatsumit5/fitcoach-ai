import React from "react";
import { View, Text } from "react-native";
import { clamp } from "@/utils/formatting";

interface MacroBarProps {
  label:   string;
  current: number;
  target:  number;
  unit:    string;
  color:   string;
}

export function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const pct     = target > 0 ? clamp(current / target, 0, 1) : 0;
  const over    = current > target;
  const display = Math.round(current);
  const tDisplay = Math.round(target);

  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between items-baseline">
        <Text className="text-gray-400 text-xs font-medium">{label}</Text>
        <Text className="text-xs" style={{ color: over ? "#ef4444" : "#9ca3af" }}>
          {display}
          <Text className="text-gray-600"> / {tDisplay}{unit}</Text>
        </Text>
      </View>

      {/* Track */}
      <View className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <View
          style={{
            width:        `${Math.min(pct * 100, 100)}%`,
            height:       "100%",
            backgroundColor: over ? "#ef4444" : color,
            borderRadius: 999,
          }}
        />
      </View>
    </View>
  );
}

interface MacroPanelProps {
  calories:       number;
  protein_g:      number;
  carbs_g:        number;
  fat_g:          number;
  targetCalories: number;
  targetProtein:  number;
  targetCarbs:    number;
  targetFat:      number;
}

export function MacroPanel({
  calories, protein_g, carbs_g, fat_g,
  targetCalories, targetProtein, targetCarbs, targetFat,
}: MacroPanelProps) {
  const calPct = targetCalories > 0 ? clamp(calories / targetCalories, 0, 1) : 0;

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl p-4 gap-4">
      {/* Calorie ring summary */}
      <View className="flex-row items-center gap-4">
        <View className="flex-1">
          <Text className="text-white text-3xl font-bold">{Math.round(calories)}</Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            of {Math.round(targetCalories)} kcal
          </Text>
        </View>
        <View className="items-center">
          <Text
            className="text-2xl font-bold"
            style={{ color: calories > targetCalories ? "#ef4444" : "#22c55e" }}
          >
            {Math.round(targetCalories - calories) > 0
              ? `${Math.round(targetCalories - calories)}`
              : "0"}
          </Text>
          <Text className="text-gray-500 text-xs">
            {calories > targetCalories ? "over" : "remaining"}
          </Text>
        </View>
      </View>

      {/* Calorie progress bar */}
      <View className="h-3 bg-surface-tertiary rounded-full overflow-hidden">
        <View
          style={{
            width:           `${Math.min(calPct * 100, 100)}%`,
            height:          "100%",
            backgroundColor: calories > targetCalories ? "#ef4444" : "#22c55e",
            borderRadius:    999,
          }}
        />
      </View>

      {/* Macros */}
      <View className="gap-3">
        <MacroBar label="Protein" current={protein_g} target={targetProtein} unit="g" color="#3b82f6" />
        <MacroBar label="Carbs"   current={carbs_g}   target={targetCarbs}   unit="g" color="#f59e0b" />
        <MacroBar label="Fat"     current={fat_g}      target={targetFat}     unit="g" color="#ec4899" />
      </View>
    </View>
  );
}
