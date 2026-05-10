import React from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "@/navigation/types";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/Button";
import { Input }  from "@/components/ui/Input";

const schema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  age:          z.string().regex(/^\d+$/, "Enter a valid age").refine((v) => +v >= 13 && +v <= 100, "Age must be between 13 and 100"),
  weight_kg:    z.string().regex(/^\d+(\.\d+)?$/, "Enter a valid weight"),
  height_cm:    z.string().regex(/^\d+(\.\d+)?$/, "Enter a valid height"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "ProfileSetup">;
};

export function ProfileSetupScreen({ navigation }: Props) {
  const { data, setField, nextStep } = useOnboardingStore();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: data.display_name,
      age:          data.age,
      weight_kg:    data.weight_kg,
      height_cm:    data.height_cm,
    },
  });

  const onSubmit = (values: FormData) => {
    setField("display_name", values.display_name);
    setField("age",          values.age);
    setField("weight_kg",    values.weight_kg);
    setField("height_cm",    values.height_cm);
    nextStep();
    navigation.navigate("Goals");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-10">
          {/* Progress */}
          <View className="flex-row gap-2 mb-10">
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                className={`h-1 flex-1 rounded-full ${step === 1 ? "bg-brand-500" : "bg-surface-border"}`}
              />
            ))}
          </View>

          <Text className="text-3xl font-bold text-white mb-1">About you</Text>
          <Text className="text-gray-400 text-base mb-8">
            Help us personalise your experience
          </Text>

          <View className="gap-4">
            <Controller
              control={control}
              name="display_name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Your name"
                  placeholder="e.g. Alex"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.display_name?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Age"
                  placeholder="e.g. 28"
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.age?.message}
                />
              )}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="weight_kg"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Weight (kg)"
                      placeholder="e.g. 75"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.weight_kg?.message}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="height_cm"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Height (cm)"
                      placeholder="e.g. 175"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.height_cm?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Button
              label="Continue"
              onPress={handleSubmit(onSubmit)}
              fullWidth
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
