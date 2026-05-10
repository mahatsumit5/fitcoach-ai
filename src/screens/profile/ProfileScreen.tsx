import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert, Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore }      from "@/stores/authStore";
import { useUIStore }        from "@/stores/uiStore";
import { useWorkoutStore }   from "@/stores/workoutStore";
import { useNutritionStore } from "@/stores/nutritionStore";
import { useCoachStore }     from "@/stores/coachStore";

type SettingRowProps = {
  label:     string;
  icon:      string;
  onPress?:  () => void;
  value?:    string;
  toggle?:   boolean;
  toggled?:  boolean;
  onToggle?: (v: boolean) => void;
  danger?:   boolean;
};

function SettingRow({
  label, icon, onPress, value, toggle, toggled, onToggle, danger,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={toggle}
      activeOpacity={toggle ? 1 : 0.7}
      className="flex-row items-center gap-4 px-4 py-3.5"
    >
      <View className="w-9 h-9 rounded-xl bg-surface-tertiary items-center justify-center">
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>

      <Text
        className={`flex-1 text-base font-medium ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {label}
      </Text>

      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: "#2a2a2a", true: "#22c55e" }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text className="text-gray-500 text-sm">{value}</Text>
      ) : (
        <Text className="text-gray-600 text-lg">›</Text>
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 pt-5 pb-2">
      {title}
    </Text>
  );
}

function Divider() {
  return <View className="h-px bg-surface-border mx-4" />;
}

export function ProfileScreen() {
  const { profile, signOut, isLoading } = useAuthStore();
  const { showToast }   = useUIStore();
  const [notifs, setNotifs] = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text:  "Sign out",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all local stores on logout
              useWorkoutStore.getState().abandonSession();
              useNutritionStore.getState().resetDay();
              useCoachStore.getState().clearHistory();
              await signOut();
            } catch {
              showToast("Failed to sign out. Try again.", "error");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text:  "Delete",
          style: "destructive",
          onPress: () => {
            showToast("Contact support to delete your account.", "info");
          },
        },
      ]
    );
  };

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <Text className="text-white text-2xl font-bold px-5 pt-4 pb-6">Profile</Text>

        {/* Avatar + name */}
        <View className="items-center pb-8 gap-3">
          <View className="w-20 h-20 rounded-full bg-brand-500 items-center justify-center">
            <Text className="text-white text-3xl font-bold">{initials}</Text>
          </View>
          <View className="items-center gap-1">
            <Text className="text-white text-xl font-semibold">
              {profile?.display_name ?? "Athlete"}
            </Text>
            <Text className="text-gray-500 text-sm">{profile?.email}</Text>
          </View>

          {/* Stats row */}
          <View className="flex-row gap-6 mt-2">
            {[
              { label: "Goal",       value: profile?.fitness_goal?.replace("_", " ")   ?? "—" },
              { label: "Level",      value: profile?.experience_level ?? "—" },
              { label: "Days/week",  value: String(profile?.days_per_week ?? "—") },
            ].map((stat) => (
              <View key={stat.label} className="items-center gap-1">
                <Text className="text-white font-semibold capitalize">{stat.value}</Text>
                <Text className="text-gray-500 text-xs">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account */}
        <View className="bg-surface-card border border-surface-border rounded-3xl mx-4 overflow-hidden">
          <SectionHeader title="Account" />
          <SettingRow icon="👤" label="Edit profile"    onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <SettingRow icon="🎯" label="Change goal"     onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <SettingRow icon="🔒" label="Change password" onPress={() => showToast("Coming soon", "info")} />
        </View>

        {/* Notifications */}
        <View className="bg-surface-card border border-surface-border rounded-3xl mx-4 mt-4 overflow-hidden">
          <SectionHeader title="Notifications" />
          <SettingRow
            icon="🔔" label="Workout reminders"
            toggle toggled={notifs} onToggle={setNotifs}
          />
          <Divider />
          <SettingRow
            icon="💧" label="Water reminders"
            toggle toggled={waterReminder} onToggle={setWaterReminder}
          />
        </View>

        {/* App */}
        <View className="bg-surface-card border border-surface-border rounded-3xl mx-4 mt-4 overflow-hidden">
          <SectionHeader title="App" />
          <SettingRow icon="⭐" label="Rate FitCoach"    onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <SettingRow icon="📧" label="Contact support"  onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <SettingRow icon="📄" label="Privacy policy"   onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <SettingRow icon="ℹ️"  label="Version"          value="1.0.0" />
        </View>

        {/* Sign out */}
        <View className="bg-surface-card border border-surface-border rounded-3xl mx-4 mt-4 overflow-hidden">
          <SettingRow
            icon="🚪"
            label={isLoading ? "Signing out..." : "Sign out"}
            onPress={handleLogout}
            danger
          />
          <Divider />
          <SettingRow
            icon="🗑️"
            label="Delete account"
            onPress={handleDeleteAccount}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
