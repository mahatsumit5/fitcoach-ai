import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore }      from "@/stores/authStore";
import { useNotifications }  from "@/hooks/useNotifications";
import { AuthStack }         from "./AuthStack";
import { OnboardingStack }   from "./OnboardingStack";
import { MainTabNavigator }  from "./MainTabNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}

function AppNavigator() {
  const { user, profile, isLoading, isInitialized } = useAuthStore();

  // Wire up push notifications
  useNotifications();

  if (!isInitialized || isLoading) return <SplashScreen />;

  const isOnboarded = profile?.onboarding_complete === true;

  return (
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
  );
}

export function RootNavigator() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
