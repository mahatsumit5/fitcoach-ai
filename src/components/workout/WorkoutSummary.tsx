import React from "react";
import { View, Text } from "react-native";
import type { ActiveWorkoutSession } from "@/types";
import { formatDurationLong } from "@/utils/formatting";

interface WorkoutSummaryProps {
  session:  ActiveWorkoutSession;
  duration: number;
}

export function WorkoutSummary({ session, duration }: WorkoutSummaryProps) {
  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets_logged.filter((s) => s.completed).length, 0
  );
  const totalVolume = session.exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets_logged
        .filter((s) => s.completed)
        .reduce((a, s) => a + s.reps * s.weight_kg, 0),
    0
  );

  const stats = [
    { label: "Duration",    value: formatDurationLong(duration) },
    { label: "Exercises",   value: String(session.exercises.length) },
    { label: "Sets done",   value: String(totalSets) },
    { label: "Volume",      value: `${Math.round(totalVolume).toLocaleString()} kg` },
  ];

  return (
    <View className="gap-4">
      <View className="items-center py-4">
        <Text className="text-5xl">🏆</Text>
        <Text className="text-white text-2xl font-bold mt-3">Workout complete!</Text>
        <Text className="text-gray-400 text-sm mt-1">{session.name}</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="flex-1 bg-surface-secondary border border-surface-border rounded-2xl p-4 items-center"
            style={{ minWidth: "40%" }}
          >
            <Text className="text-brand-500 text-2xl font-bold">{stat.value}</Text>
            <Text className="text-gray-500 text-xs mt-1">{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
