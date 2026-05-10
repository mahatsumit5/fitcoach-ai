import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Alert, Modal, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation }   from "@react-navigation/native";
import { useActiveWorkout } from "@/hooks/useWorkout";
import { useUIStore }       from "@/stores/uiStore";
import { EXERCISES, MUSCLE_GROUPS, searchExercises } from "@/data/exercises";
import { ExerciseCard }  from "@/components/workout/ExerciseCard";
import { WorkoutTimer }  from "@/components/workout/WorkoutTimer";
import { WorkoutSummary } from "@/components/workout/WorkoutSummary";
import { Button }         from "@/components/ui/Button";
import type { ActiveExercise } from "@/types";

const WORKOUT_TEMPLATES = [
  {
    name: "Push Day",
    exercises: ["Bench Press", "Incline Dumbbell Press", "Overhead Press", "Lateral Raise", "Tricep Pushdown"],
  },
  {
    name: "Pull Day",
    exercises: ["Pull Up", "Barbell Row", "Lat Pulldown", "Seated Cable Row", "Barbell Curl"],
  },
  {
    name: "Leg Day",
    exercises: ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Calf Raise"],
  },
  {
    name: "Full Body",
    exercises: ["Squat", "Bench Press", "Barbell Row", "Overhead Press", "Deadlift"],
  },
];

function ExercisePicker({
  visible, onClose, onAdd,
}: { visible: boolean; onClose: () => void; onAdd: (ex: ActiveExercise) => void }) {
  const [query,       setQuery]       = useState("");
  const [activeGroup, setActiveGroup] = useState("all");

  const filtered = query
    ? searchExercises(query)
    : activeGroup === "all"
    ? EXERCISES
    : EXERCISES.filter((e) => e.muscle_group === activeGroup);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-surface-primary">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-border">
            <Text className="text-white text-lg font-semibold">Add exercise</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-400 text-base">Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="px-5 py-3">
            <View className="flex-row items-center bg-surface-secondary border border-surface-border rounded-2xl px-4 h-12">
              <Text className="text-gray-500 mr-2">🔍</Text>
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Search exercises..."
                placeholderTextColor="#4b5563"
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Muscle group filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            {["all", ...MUSCLE_GROUPS].map((group) => (
              <TouchableOpacity
                key={group}
                onPress={() => setActiveGroup(group)}
                className={`px-4 py-1.5 rounded-full border ${
                  activeGroup === group
                    ? "bg-brand-500 border-brand-500"
                    : "border-surface-border bg-surface-secondary"
                }`}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    activeGroup === group ? "text-white" : "text-gray-400"
                  }`}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exercise list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onAdd({
                    id:           item.id + "_" + Date.now(),
                    name:         item.name,
                    muscle_group: item.muscle_group,
                    sets_planned: 3,
                    reps_planned: "10",
                    weight_kg:    0,
                    rest_seconds: 90,
                    sets_logged:  [],
                  });
                  onClose();
                }}
                className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3"
              >
                <View className="flex-1">
                  <Text className="text-white font-medium">{item.name}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5 capitalize">
                    {item.muscle_group} · {item.equipment} · {item.difficulty}
                  </Text>
                </View>
                <Text className="text-brand-400 text-xl">+</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function ActiveWorkoutScreen() {
  const navigation = useNavigation<any>();
  const {
    activeSession, elapsedSeconds,
    startSession, logSet, updateSet, removeSet,
    addExercise, removeExercise,
    finishWorkout, abandonSession, isSaving,
  } = useActiveWorkout();
  const { showToast } = useUIStore();

  const [showPicker,   setShowPicker]   = useState(false);
  const [showSummary,  setShowSummary]  = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);

  // No active session — show template picker
  if (!activeSession) {
    return (
      <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <Text className="text-gray-400">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-2">Start workout</Text>
          <Text className="text-gray-400 text-base mb-8">Choose a template or build your own</Text>

          {WORKOUT_TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.name}
              onPress={() => {
                const exercises: ActiveExercise[] = template.exercises
                  .map((name) => {
                    const found = EXERCISES.find((e) => e.name === name);
                    return {
                      id:           (found?.id ?? name) + "_" + Date.now() + Math.random(),
                      name,
                      muscle_group: found?.muscle_group ?? "other",
                      sets_planned: 3,
                      reps_planned: "10",
                      weight_kg:    0,
                      rest_seconds: 90,
                      sets_logged:  [],
                    };
                  });
                startSession(template.name, exercises);
              }}
              className="bg-surface-card border border-surface-border rounded-3xl p-4 mb-3"
            >
              <Text className="text-white font-semibold text-base">{template.name}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {template.exercises.slice(0, 3).join(" · ")}
                {template.exercises.length > 3 ? ` +${template.exercises.length - 3} more` : ""}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => startSession("Custom workout", [])}
            className="border border-dashed border-surface-border rounded-3xl p-4 items-center mt-2"
          >
            <Text className="text-brand-400 font-semibold">+ Build from scratch</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Summary screen after finish
  if (showSummary && savedSession) {
    return (
      <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <WorkoutSummary session={savedSession} duration={elapsedSeconds} />
          <View className="mt-8">
            <Button
              label="Back to workouts"
              onPress={() => {
                setShowSummary(false);
                navigation.goBack();
              }}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active workout
  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-border">
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Abandon workout?", "Your progress will be lost.", [
              { text: "Cancel", style: "cancel" },
              { text: "Abandon", style: "destructive", onPress: () => { abandonSession(); navigation.goBack(); } },
            ])
          }
        >
          <Text className="text-gray-400">✕</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white font-semibold">{activeSession.name}</Text>
          <WorkoutTimer seconds={elapsedSeconds} size="sm" />
        </View>

        <Button
          label="Finish"
          size="sm"
          loading={isSaving}
          onPress={async () => {
            const snap = { ...activeSession };
            await finishWorkout();
            setSavedSession(snap);
            setShowSummary(true);
          }}
        />
      </View>

      {/* Exercises */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {activeSession.exercises.length === 0 && (
          <View className="items-center py-16">
            <Text style={{ fontSize: 40 }}>💪</Text>
            <Text className="text-gray-400 text-base mt-4">No exercises yet</Text>
            <Text className="text-gray-600 text-sm mt-1">Tap below to add your first one</Text>
          </View>
        )}

        {activeSession.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onLogSet={(set)         => logSet(exercise.id, set)}
            onUpdateSet={(i, set)   => updateSet(exercise.id, i, set)}
            onRemoveSet={(i)        => removeSet(exercise.id, i)}
            onRemove={() =>
              Alert.alert("Remove exercise?", exercise.name, [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => removeExercise(exercise.id) },
              ])
            }
          />
        ))}
      </ScrollView>

      {/* Add exercise FAB */}
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="bg-brand-500 rounded-full px-6 py-3.5 flex-row items-center gap-2"
        >
          <Text className="text-white text-lg font-bold">+</Text>
          <Text className="text-white font-semibold">Add exercise</Text>
        </TouchableOpacity>
      </View>

      <ExercisePicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={(ex) => addExercise(ex)}
      />
    </SafeAreaView>
  );
}
