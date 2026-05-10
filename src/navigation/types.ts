import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";

// ─── Stack param lists ────────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth:        undefined;
  Onboarding:  undefined;
  Main:        undefined;
};

export type AuthStackParamList = {
  Login:          undefined;
  Register:       undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup:  undefined;
  Goals:         undefined;
  Preferences:   undefined;
};

export type MainTabParamList = {
  Dashboard:  undefined;
  Workouts:   undefined;
  Coach:      undefined;
  Nutrition:  undefined;
  Progress:   undefined;
};

export type WorkoutsStackParamList = {
  WorkoutList:    undefined;
  ActiveWorkout:  { planId?: string; sessionId?: string };
  WorkoutHistory: undefined;
  WorkoutDetail:  { sessionId: string };
};

// ─── Navigation prop helpers ──────────────────────────────────────────────────
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type OnboardingNavigationProp =
  NativeStackNavigationProp<OnboardingStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
