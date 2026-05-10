import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "./types";
import { ProfileSetupScreen } from "@/screens/onboarding/ProfileSetupScreen";
import { GoalsScreen }        from "@/screens/onboarding/GoalsScreen";
import { PreferencesScreen }  from "@/screens/onboarding/PreferencesScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileSetup"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    >
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Goals"        component={GoalsScreen} />
      <Stack.Screen name="Preferences"  component={PreferencesScreen} />
    </Stack.Navigator>
  );
}
