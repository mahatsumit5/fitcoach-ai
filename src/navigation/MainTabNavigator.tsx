import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";

// Placeholder screens — replaced in Sprint 2+
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { WorkoutsScreen }  from "@/screens/workouts/WorkoutsScreen";
import { CoachScreen }     from "@/screens/coach/CoachScreen";
import { NutritionScreen } from "@/screens/nutrition/NutritionScreen";
import { ProgressScreen }  from "@/screens/progress/ProgressScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconProps = { focused: boolean; color: string };

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: "⊡",
    Workouts:  "◈",
    Coach:     "◎",
    Nutrition: "◉",
    Progress:  "◈",
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
      {icons[name] ?? "○"}
    </Text>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              fontSize: 10,
              color,
              fontWeight: focused ? "600" : "400",
              marginBottom: 4,
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopColor: "#2a2a2a",
          borderTopWidth: 0.5,
          height: 80,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts"  component={WorkoutsScreen} />
      <Tab.Screen name="Coach"     component={CoachScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Progress"  component={ProgressScreen} />
    </Tab.Navigator>
  );
}
