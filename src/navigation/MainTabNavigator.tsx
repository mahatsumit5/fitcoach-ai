import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LayoutDashboard, Dumbbell, Bot, Apple, TrendingUp, UserCircle,
} from "lucide-react-native";
import type { MainTabParamList } from "./types";
import { useTheme }          from "@/hooks/useTheme";
import { DashboardScreen }   from "@/screens/dashboard/DashboardScreen";
import { WorkoutsStack }     from "./WorkoutsStack";
import { CoachScreen }       from "@/screens/coach/CoachScreen";
import { NutritionScreen }   from "@/screens/nutrition/NutritionScreen";
import { ProgressScreen }    from "@/screens/progress/ProgressScreen";
import { ProfileScreen }     from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, any> = {
  Dashboard: LayoutDashboard,
  Workouts:  Dumbbell,
  Coach:     Bot,
  Nutrition: Apple,
  Progress:  TrendingUp,
  Profile:   UserCircle,
};

export function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icon = TAB_ICONS[route.name];
        return {
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon size={26} color={color} strokeWidth={focused ? 2.2 : 1.8} />
          ),
          tabBarLabelStyle: {
            fontSize:     12,
            fontWeight:   "500",
            marginBottom: 4,
          },
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor:  theme.tabBorder,
            borderTopWidth:  0.5,
            height:          82,
            paddingTop:      8,
          },
          tabBarActiveTintColor:   theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
        };
      }}
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
