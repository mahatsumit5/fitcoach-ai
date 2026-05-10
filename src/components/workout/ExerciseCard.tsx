import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { ActiveExercise, SetLog } from "@/types";
import { SetRow } from "./SetRow";

interface ExerciseCardProps {
  exercise:     ActiveExercise;
  onLogSet:     (set: SetLog) => void;
  onUpdateSet:  (index: number, set: Partial<SetLog>) => void;
  onRemoveSet:  (index: number) => void;
  onRemove:     () => void;
}

export function ExerciseCard({
  exercise,
  onLogSet,
  onUpdateSet,
  onRemoveSet,
  onRemove,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(true);

  const completedSets = exercise.sets_logged.filter((s) => s.completed).length;
  const totalSets     = exercise.sets_planned;

  const addSet = () => {
    const last = exercise.sets_logged[exercise.sets_logged.length - 1];
    onLogSet({
      set_number: exercise.sets_logged.length + 1,
      reps:       last?.reps       ?? parseInt(exercise.reps_planned) ?? 0,
      weight_kg:  last?.weight_kg  ?? exercise.weight_kg,
      completed:  false,
    });
  };

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl mb-3 overflow-hidden">
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center justify-between px-4 py-3"
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">{exercise.name}</Text>
          <Text className="text-gray-500 text-xs mt-0.5 capitalize">
            {exercise.muscle_group} · {completedSets}/{totalSets} sets
          </Text>
        </View>

        {/* Progress dots */}
        <View className="flex-row gap-1 mr-3">
          {Array.from({ length: totalSets }).map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < completedSets ? "bg-brand-500" : "bg-surface-border"
              }`}
            />
          ))}
        </View>

        <Text className="text-gray-500 text-lg">{expanded ? "⌃" : "⌄"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 pb-4">
          {/* Column headers */}
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8" />
            <Text className="flex-1 text-xs text-gray-500 text-center">Weight</Text>
            <Text className="flex-1 text-xs text-gray-500 text-center">Reps</Text>
            <View className="w-10" />
            <View className="w-8" />
          </View>

          {/* Set rows */}
          {exercise.sets_logged.map((set, idx) => (
            <SetRow
              key={idx}
              setNumber={idx + 1}
              set={set}
              onChange={(updated) => onUpdateSet(idx, updated)}
              onRemove={() => onRemoveSet(idx)}
            />
          ))}

          {/* Add set button */}
          <TouchableOpacity
            onPress={addSet}
            className="flex-row items-center justify-center gap-2 mt-2 py-2.5 border border-dashed border-surface-border rounded-xl"
          >
            <Text className="text-brand-400 text-sm font-medium">+ Add set</Text>
          </TouchableOpacity>

          {/* Remove exercise */}
          <TouchableOpacity onPress={onRemove} className="mt-2 items-center py-1">
            <Text className="text-gray-600 text-xs">Remove exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
