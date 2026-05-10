import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNutrition }      from "@/hooks/useNutrition";
import { useNutritionStore } from "@/stores/nutritionStore";
import { useCoach }          from "@/hooks/useCoach";
import { MacroPanel }        from "@/components/nutrition/MacroBar";
import { WaterTracker }      from "@/components/nutrition/WaterTracker";
import { MealCard }          from "@/components/nutrition/MealCard";
import { Button }            from "@/components/ui/Button";
import { Skeleton }          from "@/components/ui/SkeletonLoader";

// ─── Log meal modal ───────────────────────────────────────────────────────────
function LogMealModal({
  visible,
  onClose,
  onSave,
  isLogging,
}: {
  visible:   boolean;
  onClose:   () => void;
  onSave:    (meal: { meal_name: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void;
  isLogging: boolean;
}) {
  const [name,     setName]     = useState("");
  const [calories, setCalories] = useState("");
  const [protein,  setProtein]  = useState("");
  const [carbs,    setCarbs]    = useState("");
  const [fat,      setFat]      = useState("");

  const reset = () => { setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat(""); };

  const handleSave = () => {
    if (!name || !calories) return;
    onSave({
      meal_name: name,
      calories:  parseFloat(calories) || 0,
      protein_g: parseFloat(protein)  || 0,
      carbs_g:   parseFloat(carbs)    || 0,
      fat_g:     parseFloat(fat)      || 0,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        className="flex-1 bg-surface-primary"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-border">
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold">Log meal</Text>
            <TouchableOpacity onPress={handleSave} disabled={!name || !calories}>
              <Text className={`font-semibold ${name && calories ? "text-brand-400" : "text-gray-600"}`}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
            {[
              { label: "Meal name",   value: name,     set: setName,     type: "default",     placeholder: "e.g. Chicken rice bowl" },
              { label: "Calories",    value: calories, set: setCalories, type: "decimal-pad", placeholder: "kcal" },
              { label: "Protein (g)", value: protein,  set: setProtein,  type: "decimal-pad", placeholder: "g" },
              { label: "Carbs (g)",   value: carbs,    set: setCarbs,    type: "decimal-pad", placeholder: "g" },
              { label: "Fat (g)",     value: fat,      set: setFat,      type: "decimal-pad", placeholder: "g" },
            ].map((field) => (
              <View key={field.label}>
                <Text className="text-gray-400 text-sm mb-1.5 font-medium">{field.label}</Text>
                <TextInput
                  className="bg-surface-secondary border border-surface-border rounded-2xl px-4 h-14 text-white text-base"
                  placeholder={field.placeholder}
                  placeholderTextColor="#4b5563"
                  value={field.value}
                  onChangeText={field.set}
                  keyboardType={field.type as any}
                  autoCapitalize="sentences"
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export function NutritionScreen() {
  const { meals, isLoading, waterMl, logMeal, deleteMeal, logWater, isLogging } = useNutrition();
  const { macroTargets, getTotals } = useNutritionStore();
  const { generateMealPlan, isGeneratingMeal, generatedMeal } = useCoach();
  const [showModal, setShowModal] = useState(false);

  const totals = getTotals();

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-2xl font-bold">Nutrition</Text>
          <Text className="text-gray-500 text-sm">
            {new Date().toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
          </Text>
        </View>

        {/* Macros panel */}
        {isLoading ? (
          <Skeleton height={180} borderRadius={20} />
        ) : (
          <MacroPanel
            calories={totals.calories}
            protein_g={totals.protein_g}
            carbs_g={totals.carbs_g}
            fat_g={totals.fat_g}
            targetCalories={macroTargets.calories}
            targetProtein={macroTargets.protein_g}
            targetCarbs={macroTargets.carbs_g}
            targetFat={macroTargets.fat_g}
          />
        )}

        {/* Water tracker */}
        <View className="mt-4">
          <WaterTracker
            currentMl={waterMl}
            targetMl={macroTargets.water_ml}
            onAdd={logWater}
          />
        </View>

        {/* AI meal plan */}
        <TouchableOpacity
          onPress={() => generateMealPlan(macroTargets.calories)}
          disabled={isGeneratingMeal}
          className="mt-4 bg-surface-secondary border border-surface-border rounded-3xl p-4 flex-row items-center gap-3"
        >
          <Text style={{ fontSize: 24 }}>🤖</Text>
          <View className="flex-1">
            <Text className="text-white font-semibold">Generate meal plan</Text>
            <Text className="text-gray-500 text-xs mt-0.5">AI-powered for your goals</Text>
          </View>
          {isGeneratingMeal ? (
            <Text className="text-brand-400 text-sm">Generating...</Text>
          ) : (
            <Text className="text-gray-600">›</Text>
          )}
        </TouchableOpacity>

        {/* Generated meal plan */}
        {generatedMeal && (
          <View className="mt-4 bg-surface-card border border-surface-border rounded-3xl overflow-hidden">
            <View className="bg-brand-900/40 px-4 py-3 border-b border-surface-border">
              <Text className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                AI Meal Plan
              </Text>
            </View>
            {generatedMeal.meals.map((meal, i) => (
              <View key={i} className="px-4 py-3 border-b border-surface-border last:border-0">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white font-medium">{meal.name}</Text>
                  <Text className="text-gray-500 text-xs">{meal.time}</Text>
                </View>
                <View className="flex-row gap-3 mt-1">
                  <Text className="text-gray-400 text-xs">{meal.total_calories} kcal</Text>
                  <Text className="text-blue-400 text-xs">P {Math.round(meal.total_protein_g)}g</Text>
                  <Text className="text-yellow-400 text-xs">C {Math.round(meal.total_carbs_g)}g</Text>
                </View>
                <TouchableOpacity
                  onPress={() => logMeal({
                    meal_name: meal.name,
                    calories:  meal.total_calories,
                    protein_g: meal.total_protein_g,
                    carbs_g:   meal.total_carbs_g,
                    fat_g:     meal.total_fat_g,
                  })}
                  className="mt-2 self-start"
                >
                  <Text className="text-brand-400 text-xs font-medium">+ Log this meal</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Today's meals */}
        <View className="flex-row items-center justify-between mt-6 mb-3">
          <Text className="text-white font-semibold">Today's meals</Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="bg-brand-500 rounded-full px-4 py-1.5"
          >
            <Text className="text-white text-sm font-semibold">+ Log meal</Text>
          </TouchableOpacity>
        </View>

        {meals.length === 0 ? (
          <View className="items-center py-8">
            <Text style={{ fontSize: 32 }}>🥗</Text>
            <Text className="text-gray-500 text-sm mt-3">No meals logged yet today</Text>
          </View>
        ) : (
          <View className="gap-2">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => deleteMeal(meal.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <LogMealModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={logMeal}
        isLogging={isLogging}
      />
    </SafeAreaView>
  );
}
