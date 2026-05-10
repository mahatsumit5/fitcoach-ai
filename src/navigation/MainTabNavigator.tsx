import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { WorkoutsStack }   from "./WorkoutsStack";
import { CoachScreen }     from "@/screens/coach/CoachScreen";
import { NutritionScreen } from "@/screens/nutrition/NutritionScreen";
import { ProgressScreen }  from "@/screens/progress/ProgressScreen";
import { ProfileScreen }   from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, string> = {
  Dashboard: "⊡",
  Workouts:  "◈",
  Coach:     "◎",
  Nutrition: "⊕",
  Progress:  "◉",
  Profile:   "◐",
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              fontSize:   10,
              color,
              fontWeight: focused ? "600" : "400",
              marginBottom: 4,
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor:  "#141414",
          borderTopColor:   "#2a2a2a",
          borderTopWidth:   0.5,
          height:           80,
          paddingTop:       8,
        },
        tabBarActiveTintColor:   "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts"  component={WorkoutsStack} />
      <Tab.Screen name="Coach"     component={CoachScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Progress"  component={ProgressScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}
