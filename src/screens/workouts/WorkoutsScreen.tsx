import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, FlatList,
} from "react-native";
import { SafeAreaView }    from "react-native-safe-area-context";
import { useNavigation }   from "@react-navigation/native";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useWorkoutHistory } from "@/hooks/useWorkout";
import { EXERCISES, MUSCLE_GROUPS, searchExercises } from "@/data/exercises";
import type { ActiveExercise } from "@/types";
import { WorkoutCardSkeleton } from "@/components/ui/SkeletonLoader";
import { Badge }           from "@/components/ui/Badge";
import { Button }          from "@/components/ui/Button";
import { formatDurationLong, formatDate } from "@/utils/formatting";

export function WorkoutsScreen() {
  const navigation = useNavigation<any>();
  const { activeSession } = useWorkoutStore();
  const { data: history, isLoading } = useWorkoutHistory();

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-2xl font-bold mb-6">Workouts</Text>

        {/* Active session CTA */}
        {activeSession ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("ActiveWorkout")}
            className="bg-brand-900/40 border border-brand-500 rounded-3xl p-4 mb-6"
          >
            <Text className="text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Resume workout
            </Text>
            <Text className="text-white font-semibold text-lg">{activeSession.name}</Text>
            <Text className="text-gray-400 text-sm mt-0.5">
              {activeSession.exercises.length} exercises · Tap to continue
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("ActiveWorkout")}
            className="bg-brand-500 rounded-3xl p-5 mb-6 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-white font-bold text-lg">Start workout</Text>
              <Text className="text-green-100 text-sm mt-0.5">Build your session</Text>
            </View>
            <Text className="text-white text-3xl">+</Text>
          </TouchableOpacity>
        )}

        {/* History */}
        <Text className="text-white font-semibold text-base mb-3">Recent workouts</Text>
        {isLoading ? (
          <View className="gap-3">
            <WorkoutCardSkeleton />
            <WorkoutCardSkeleton />
            <WorkoutCardSkeleton />
          </View>
        ) : history && history.length > 0 ? (
          <View className="gap-3">
            {history.map((session) => (
              <View
                key={session.id}
                className="bg-surface-card border border-surface-border rounded-3xl p-4"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{session.name}</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {formatDate(session.started_at)}
                    </Text>
                  </View>
                  <Badge label="Done" variant="success" />
                </View>
                <View className="flex-row gap-4 mt-3">
                  {session.duration_seconds && (
                    <View>
                      <Text className="text-brand-500 font-semibold">
                        {formatDurationLong(session.duration_seconds)}
                      </Text>
                      <Text className="text-gray-500 text-xs">duration</Text>
                    </View>
                  )}
                  {session.calories_burned && (
                    <View>
                      <Text className="text-brand-500 font-semibold">
                        {session.calories_burned}
                      </Text>
                      <Text className="text-gray-500 text-xs">calories</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-12">
            <Text style={{ fontSize: 40 }}>🏋️</Text>
            <Text className="text-gray-400 text-base mt-4">No workouts yet</Text>
            <Text className="text-gray-600 text-sm mt-1">Start your first session above</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
