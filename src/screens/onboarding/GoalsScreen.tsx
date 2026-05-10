import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "@/navigation/types";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/Button";
import type { FitnessGoal, ExperienceLevel } from "@/types";

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "Goals">;
};

const GOALS: { value: FitnessGoal; label: string; icon: string; desc: string }[] = [
  { value: "lose_weight",          label: "Lose weight",        icon: "🔥", desc: "Burn fat and slim down" },
  { value: "build_muscle",         label: "Build muscle",       icon: "💪", desc: "Gain strength and size" },
  { value: "improve_endurance",    label: "Improve endurance",  icon: "🏃", desc: "Run faster and longer" },
  { value: "stay_active",          label: "Stay active",        icon: "⚡", desc: "Maintain a healthy lifestyle" },
  { value: "increase_flexibility", label: "Flexibility",        icon: "🧘", desc: "Improve mobility and stretch" },
];

const LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: "beginner",     label: "Beginner",     desc: "Less than 1 year training" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 years training" },
  { value: "advanced",     label: "Advanced",     desc: "3+ years training" },
];

const DAYS = [3, 4, 5, 6];

export function GoalsScreen({ navigation }: Props) {
  const { data, setField, nextStep, prevStep } = useOnboardingStore();
  const [error, setError] = useState("");

  const onContinue = () => {
    if (!data.fitness_goal || !data.experience_level) {
      setError("Please select a goal and experience level.");
      return;
    }
    setError("");
    nextStep();
    navigation.navigate("Preferences");
  };

  return (
    <ScrollView
      className="flex-1 bg-surface-primary"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-16">
        {/* Progress */}
        <View className="flex-row gap-2 mb-10">
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`h-1 flex-1 rounded-full ${step <= 2 ? "bg-brand-500" : "bg-surface-border"}`}
            />
          ))}
        </View>

        <Text className="text-3xl font-bold text-white mb-1">Your goals</Text>
        <Text className="text-gray-400 text-base mb-8">What do you want to achieve?</Text>

        {/* Goal selector */}
        <Text className="text-white font-semibold mb-3">Primary goal</Text>
        <View className="gap-2 mb-8">
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              onPress={() => setField("fitness_goal", goal.value)}
              className={`flex-row items-center gap-4 p-4 rounded-2xl border ${
                data.fitness_goal === goal.value
                  ? "border-brand-500 bg-brand-900/30"
                  : "border-surface-border bg-surface-secondary"
              }`}
            >
              <Text style={{ fontSize: 24 }}>{goal.icon}</Text>
              <View className="flex-1">
                <Text className="text-white font-medium">{goal.label}</Text>
                <Text className="text-gray-500 text-xs mt-0.5">{goal.desc}</Text>
              </View>
              {data.fitness_goal === goal.value && (
                <View className="w-5 h-5 rounded-full bg-brand-500 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience level */}
        <Text className="text-white font-semibold mb-3">Experience level</Text>
        <View className="flex-row gap-2 mb-8">
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              onPress={() => setField("experience_level", level.value)}
              className={`flex-1 p-3 rounded-2xl border items-center ${
                data.experience_level === level.value
                  ? "border-brand-500 bg-brand-900/30"
                  : "border-surface-border bg-surface-secondary"
              }`}
            >
              <Text className="text-white text-sm font-medium">{level.label}</Text>
              <Text className="text-gray-500 text-xs mt-1 text-center">{level.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Days per week */}
        <Text className="text-white font-semibold mb-3">Days per week</Text>
        <View className="flex-row gap-2 mb-8">
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setField("days_per_week", day)}
              className={`flex-1 h-12 rounded-2xl border items-center justify-center ${
                data.days_per_week === day
                  ? "border-brand-500 bg-brand-500"
                  : "border-surface-border bg-surface-secondary"
              }`}
            >
              <Text className={`font-semibold ${data.days_per_week === day ? "text-white" : "text-gray-400"}`}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text className="text-red-400 text-sm mb-4">{error}</Text> : null}

        <View className="flex-row gap-3">
          <Button
            label="Back"
            variant="secondary"
            onPress={() => { prevStep(); navigation.goBack(); }}
            size="lg"
          />
          <View className="flex-1">
            <Button label="Continue" onPress={onContinue} fullWidth size="lg" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
