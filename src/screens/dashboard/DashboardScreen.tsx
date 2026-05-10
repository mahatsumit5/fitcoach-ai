import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore }    from "@/stores/authStore";
import { useWeeklyStats }  from "@/hooks/useWorkout";
import { useWorkoutStore } from "@/stores/workoutStore";
import { WorkoutTimer }    from "@/components/workout/WorkoutTimer";
import { Skeleton }        from "@/components/ui/SkeletonLoader";
import { formatDurationLong } from "@/utils/formatting";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-surface-secondary border border-surface-border rounded-2xl p-4">
      <Text className="text-brand-500 text-2xl font-bold">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const { profile }       = useAuthStore();
  const { data: stats, isLoading } = useWeeklyStats();
  const { activeSession, elapsedSeconds } = useWorkoutStore();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-400 text-sm">{greeting()}</Text>
            <Text className="text-white text-2xl font-bold mt-0.5">
              {profile?.display_name ?? "Athlete"} 👋
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-brand-500 items-center justify-center">
            <Text className="text-white font-bold text-base">
              {profile?.display_name?.[0]?.toUpperCase() ?? "A"}
            </Text>
          </View>
        </View>

        {/* Active session banner */}
        {activeSession && (
          <View className="bg-brand-900/40 border border-brand-500 rounded-3xl p-4 mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                Active workout
              </Text>
              <Text className="text-white font-semibold mt-1">{activeSession.name}</Text>
            </View>
            <WorkoutTimer seconds={elapsedSeconds} size="sm" />
          </View>
        )}

        {/* Weekly stats */}
        <Text className="text-white font-semibold text-base mb-3">This week</Text>
        {isLoading ? (
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
          </View>
        ) : (
          <View className="flex-row gap-3 mb-6">
            <StatCard label="Workouts"  value={String(stats?.count ?? 0)} />
            <StatCard label="Minutes"   value={String(stats?.totalMinutes ?? 0)} />
            <StatCard label="Calories"  value={String(stats?.totalCalories ?? 0)} />
          </View>
        )}

        {/* Quick start */}
        <Text className="text-white font-semibold text-base mb-3">Quick start</Text>
        <View className="gap-3">
          {QUICK_WORKOUTS.map((w) => (
            <TouchableOpacity
              key={w.name}
              className="bg-surface-card border border-surface-border rounded-3xl p-4 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 rounded-2xl bg-surface-tertiary items-center justify-center">
                <Text style={{ fontSize: 24 }}>{w.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{w.name}</Text>
                <Text className="text-gray-500 text-xs mt-0.5">{w.desc}</Text>
              </View>
              <Text className="text-gray-600 text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const QUICK_WORKOUTS = [
  { name: "Push Day",  icon: "💪", desc: "Chest · Shoulders · Triceps · 45 min" },
  { name: "Pull Day",  icon: "🏋️", desc: "Back · Biceps · 45 min" },
  { name: "Leg Day",   icon: "🦵", desc: "Quads · Hamstrings · Glutes · 50 min" },
  { name: "Full Body", icon: "⚡", desc: "All muscle groups · 60 min" },
];
