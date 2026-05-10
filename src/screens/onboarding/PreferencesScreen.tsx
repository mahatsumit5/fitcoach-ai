import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "@/navigation/types";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useProfile }         from "@/hooks/useProfile";
import { useUIStore }         from "@/stores/uiStore";
import { Button }             from "@/components/ui/Button";

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "Preferences">;
};

const EQUIPMENT_OPTIONS = ["gym", "home", "bodyweight", "dumbbells", "resistance bands"];
const DIETARY_OPTIONS   = ["none", "vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "halal"];
const INJURY_OPTIONS    = ["lower back", "knee", "shoulder", "wrist", "ankle", "neck", "hip"];

function ToggleChip({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
        selected
          ? "border-brand-500 bg-brand-900/40"
          : "border-surface-border bg-surface-secondary"
      }`}
    >
      <Text className={`text-sm font-medium ${selected ? "text-brand-400" : "text-gray-400"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function PreferencesScreen({ navigation }: Props) {
  const { data, setField, prevStep, reset } = useOnboardingStore();
  const { completeOnboarding, isUpdating }  = useProfile();
  const { showToast } = useUIStore();

  const onFinish = async () => {
    try {
      await completeOnboarding({
        display_name:     data.display_name,
        age:              parseInt(data.age),
        weight_kg:        parseFloat(data.weight_kg),
        height_cm:        parseFloat(data.height_cm),
        fitness_goal:     data.fitness_goal || null,
        experience_level: data.experience_level || null,
        days_per_week:    data.days_per_week,
        equipment:        data.equipment,
        dietary_prefs:    data.dietary_prefs,
        injuries:         data.injuries,
        onboarding_complete: true,
      });
      reset();
    } catch {
      showToast("Failed to save preferences. Try again.", "error");
    }
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
            <View key={step} className="h-1 flex-1 rounded-full bg-brand-500" />
          ))}
        </View>

        <Text className="text-3xl font-bold text-white mb-1">Preferences</Text>
        <Text className="text-gray-400 text-base mb-8">
          Help us tailor your workouts and meals
        </Text>

        {/* Equipment */}
        <Text className="text-white font-semibold mb-3">Available equipment</Text>
        <View className="flex-row flex-wrap mb-8">
          {EQUIPMENT_OPTIONS.map((opt) => (
            <ToggleChip
              key={opt}
              label={opt}
              selected={data.equipment === opt}
              onPress={() => setField("equipment", opt)}
            />
          ))}
        </View>

        {/* Dietary preferences */}
        <Text className="text-white font-semibold mb-3">Dietary preferences</Text>
        <View className="flex-row flex-wrap mb-8">
          {DIETARY_OPTIONS.map((opt) => (
            <ToggleChip
              key={opt}
              label={opt}
              selected={data.dietary_prefs.includes(opt)}
              onPress={() => setField("dietary_prefs", toggle(data.dietary_prefs, opt))}
            />
          ))}
        </View>

        {/* Injuries */}
        <Text className="text-white font-semibold mb-1">Injuries or limitations</Text>
        <Text className="text-gray-500 text-sm mb-3">
          We'll avoid exercises that strain these areas
        </Text>
        <View className="flex-row flex-wrap mb-8">
          {INJURY_OPTIONS.map((opt) => (
            <ToggleChip
              key={opt}
              label={opt}
              selected={data.injuries.includes(opt)}
              onPress={() => setField("injuries", toggle(data.injuries, opt))}
            />
          ))}
        </View>

        <View className="flex-row gap-3">
          <Button
            label="Back"
            variant="secondary"
            onPress={() => { prevStep(); navigation.goBack(); }}
            size="lg"
          />
          <View className="flex-1">
            <Button
              label="Let's go!"
              onPress={onFinish}
              loading={isUpdating}
              fullWidth
              size="lg"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
