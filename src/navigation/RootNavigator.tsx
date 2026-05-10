import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "@/stores/authStore";
import { AuthStack }        from "./AuthStack";
import { OnboardingStack }  from "./OnboardingStack";
import { MainTabNavigator } from "./MainTabNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-primary">
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}

export function RootNavigator() {
  const { user, profile, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  if (!isInitialized || isLoading) {
    return <SplashScreen />;
  }

  const isOnboarded = profile?.onboarding_complete === true;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ animation: "fade" }}
          />
        ) : !isOnboarded ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingStack}
            options={{ animation: "fade" }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ animation: "fade" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
