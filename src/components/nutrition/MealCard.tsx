import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { MealEntry } from "@/stores/nutritionStore";
import { formatTime } from "@/utils/formatting";

interface MealCardProps {
  meal:     MealEntry;
  onDelete: () => void;
}

export function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <View className="bg-surface-secondary border border-surface-border rounded-2xl px-4 py-3 flex-row items-center gap-3">
      <View className="flex-1">
        <Text className="text-white font-medium text-sm">{meal.meal_name}</Text>
        <View className="flex-row gap-3 mt-1">
          <Text className="text-gray-500 text-xs">{Math.round(meal.calories)} kcal</Text>
          <Text className="text-blue-400 text-xs">P {Math.round(meal.protein_g)}g</Text>
          <Text className="text-yellow-400 text-xs">C {Math.round(meal.carbs_g)}g</Text>
          <Text className="text-pink-400 text-xs">F {Math.round(meal.fat_g)}g</Text>
        </View>
      </View>
      <Text className="text-gray-600 text-xs">{formatTime(meal.logged_at)}</Text>
      <TouchableOpacity onPress={onDelete} className="ml-1 w-7 h-7 items-center justify-center">
        <Text className="text-gray-600 text-lg">×</Text>
      </TouchableOpacity>
    </View>
  );
}
