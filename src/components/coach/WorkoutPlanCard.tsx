import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { GeneratedWorkoutPlan } from "@/types";

interface WorkoutPlanCardProps {
  plan: GeneratedWorkoutPlan;
  onStartDay?: (dayIndex: number) => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WorkoutPlanCard({ plan, onStartDay }: WorkoutPlanCardProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden">
      {/* Header */}
      <View className="bg-brand-900/40 border-b border-surface-border px-4 py-4">
        <View className="flex-row items-center gap-2 mb-1">
          <Text style={{ fontSize: 20 }}>🤖</Text>
          <Text className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
            AI Generated Plan
          </Text>
        </View>
        <Text className="text-white text-lg font-bold">{plan.plan_name}</Text>
        <Text className="text-gray-400 text-sm mt-1">{plan.overview}</Text>
        <View className="flex-row gap-4 mt-3">
          <View>
            <Text className="text-brand-500 font-semibold">{plan.duration_weeks}w</Text>
            <Text className="text-gray-500 text-xs">duration</Text>
          </View>
          <View>
            <Text className="text-brand-500 font-semibold">{plan.days_per_week}d/w</Text>
            <Text className="text-gray-500 text-xs">frequency</Text>
          </View>
          <View>
            <Text className="text-brand-500 font-semibold">
              {plan.weekly_schedule[0]?.estimated_duration_minutes ?? 45}m
            </Text>
            <Text className="text-gray-500 text-xs">per session</Text>
          </View>
        </View>
      </View>

      {/* Schedule */}
      <View className="px-4 py-3">
        {plan.weekly_schedule.map((day, idx) => (
          <View key={idx} className="border-b border-surface-border last:border-0">
            <TouchableOpacity
              onPress={() => setExpandedDay(expandedDay === idx ? null : idx)}
              className="flex-row items-center justify-between py-3"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-surface-tertiary items-center justify-center">
                  <Text className="text-white text-xs font-semibold">
                    {DAY_NAMES[(day.day - 1) % 7]}
                  </Text>
                </View>
                <View>
                  <Text className="text-white font-medium">{day.name}</Text>
                  <Text className="text-gray-500 text-xs">
                    {day.exercises.length} exercises · {day.estimated_duration_minutes}m
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500">{expandedDay === idx ? "⌃" : "⌄"}</Text>
            </TouchableOpacity>

            {expandedDay === idx && (
              <View className="pb-3 gap-2">
                {day.exercises.map((ex, eIdx) => (
                  <View
                    key={eIdx}
                    className="flex-row items-center justify-between bg-surface-secondary rounded-2xl px-3 py-2.5"
                  >
                    <Text className="text-white text-sm flex-1">{ex.name}</Text>
                    <Text className="text-brand-400 text-sm font-medium ml-2">
                      {ex.sets}×{ex.reps}
                    </Text>
                  </View>
                ))}
                {onStartDay && (
                  <TouchableOpacity
                    onPress={() => onStartDay(idx)}
                    className="bg-brand-500 rounded-2xl py-2.5 items-center mt-1"
                  >
                    <Text className="text-white font-semibold text-sm">Start this workout</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Coach notes */}
      <View className="px-4 pb-4">
        <View className="bg-surface-secondary rounded-2xl p-3">
          <Text className="text-brand-400 text-xs font-semibold mb-1">Coach notes</Text>
          <Text className="text-gray-300 text-sm leading-5">{plan.coach_notes}</Text>
        </View>
      </View>
    </View>
  );
}
