import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WorkoutsScreen }      from "@/screens/workouts/WorkoutsScreen";
import { ActiveWorkoutScreen } from "@/screens/workouts/ActiveWorkoutScreen";

export type WorkoutsStackParamList = {
  WorkoutList:   undefined;
  ActiveWorkout: undefined;
};

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

export function WorkoutsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0a0a0a" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="WorkoutList"   component={WorkoutsScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
    </Stack.Navigator>
  );
}
