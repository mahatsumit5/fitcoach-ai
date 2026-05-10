import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { SetLog } from "@/types";

interface SetRowProps {
  setNumber: number;
  set:       SetLog;
  onChange:  (updated: Partial<SetLog>) => void;
  onRemove:  () => void;
}

export function SetRow({ setNumber, set, onChange, onRemove }: SetRowProps) {
  return (
    <View className="flex-row items-center gap-2 py-2">
      {/* Set number */}
      <View className="w-8 h-8 rounded-full bg-surface-tertiary items-center justify-center">
        <Text className="text-gray-400 text-sm font-medium">{setNumber}</Text>
      </View>

      {/* Weight */}
      <View className="flex-1">
        <Text className="text-xs text-gray-500 mb-1">kg</Text>
        <TextInput
          className="bg-surface-secondary border border-surface-border rounded-xl px-3 h-10 text-white text-center text-base"
          keyboardType="decimal-pad"
          value={set.weight_kg > 0 ? String(set.weight_kg) : ""}
          onChangeText={(v) => onChange({ weight_kg: parseFloat(v) || 0 })}
          placeholder="0"
          placeholderTextColor="#4b5563"
        />
      </View>

      {/* Reps */}
      <View className="flex-1">
        <Text className="text-xs text-gray-500 mb-1">reps</Text>
        <TextInput
          className="bg-surface-secondary border border-surface-border rounded-xl px-3 h-10 text-white text-center text-base"
          keyboardType="number-pad"
          value={set.reps > 0 ? String(set.reps) : ""}
          onChangeText={(v) => onChange({ reps: parseInt(v) || 0 })}
          placeholder="0"
          placeholderTextColor="#4b5563"
        />
      </View>

      {/* Complete toggle */}
      <TouchableOpacity
        onPress={() => onChange({ completed: !set.completed })}
        className={`w-10 h-10 rounded-xl items-center justify-center mt-5 ${
          set.completed ? "bg-brand-500" : "bg-surface-secondary border border-surface-border"
        }`}
      >
        <Text className="text-white text-base">{set.completed ? "✓" : ""}</Text>
      </TouchableOpacity>

      {/* Remove */}
      <TouchableOpacity onPress={onRemove} className="mt-5 w-8 items-center">
        <Text className="text-gray-600 text-lg">×</Text>
      </TouchableOpacity>
    </View>
  );
}
