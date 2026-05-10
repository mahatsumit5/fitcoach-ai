import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert, Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User, Target, Lock, Bell, Droplets, Star,
  Mail, FileText, Info, LogOut, Trash2, ChevronRight,
} from "lucide-react-native";
import { useAuthStore }      from "@/stores/authStore";
import { useUIStore }        from "@/stores/uiStore";
import { useWorkoutStore }   from "@/stores/workoutStore";
import { useNutritionStore } from "@/stores/nutritionStore";
import { useCoachStore }     from "@/stores/coachStore";
import { useTheme }          from "@/hooks/useTheme";
import { ThemeToggle }       from "@/components/ui/ThemeToggle";

function SectionLabel({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <Text style={{
      color: theme.textMuted, fontSize: 13, fontWeight: "600",
      textTransform: "uppercase", letterSpacing: 1,
      paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
    }}>
      {title}
    </Text>
  );
}

function Divider() {
  const { theme } = useTheme();
  return <View style={{ height: 0.5, backgroundColor: theme.border, marginHorizontal: 16 }} />;
}

function Row({
  label, Icon, iconColor, onPress,
  value, toggle, toggled, onToggle, danger,
}: {
  label: string; Icon: any; iconColor: string; onPress?: () => void;
  value?: string; toggle?: boolean; toggled?: boolean;
  onToggle?: (v: boolean) => void; danger?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={toggle}
      activeOpacity={toggle ? 1 : 0.7}
      style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 }}
    >
      <View style={{
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: theme.bgTertiary, alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} color={danger ? theme.error : iconColor} strokeWidth={2} />
      </View>
      <Text style={{ flex: 1, fontSize: 17, color: danger ? theme.error : theme.textPrimary, fontWeight: "500" }}>
        {label}
      </Text>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: theme.bgTertiary, true: theme.brand }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text style={{ color: theme.textMuted, fontSize: 15 }}>{value}</Text>
      ) : (
        <ChevronRight size={18} color={theme.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export function ProfileScreen() {
  const { profile, signOut, isLoading } = useAuthStore();
  const { showToast }   = useUIStore();
  const { theme }       = useTheme();
  const [notifs,        setNotifs]       = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out", style: "destructive",
        onPress: async () => {
          try {
            useWorkoutStore.getState().abandonSession();
            useNutritionStore.getState().resetDay();
            useCoachStore.getState().clearHistory();
            await signOut();
          } catch {
            showToast("Failed to sign out. Try again.", "error");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This permanently deletes your account and all data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: () => showToast("Contact support to delete your account.", "info"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgPrimary }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "700", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          Profile
        </Text>

        {/* Avatar */}
        <View style={{ alignItems: "center", paddingBottom: 28, gap: 12 }}>
          <View style={{
            width: 84, height: 84, borderRadius: 42,
            backgroundColor: theme.brand, alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700" }}>{initials}</Text>
          </View>
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "600" }}>
              {profile?.display_name ?? "Athlete"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 15 }}>{profile?.email}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 28, marginTop: 4 }}>
            {[
              { label: "Goal",      value: profile?.fitness_goal?.replace("_", " ")   ?? "—" },
              { label: "Level",     value: profile?.experience_level                   ?? "—" },
              { label: "Days/wk",   value: String(profile?.days_per_week              ?? "—") },
            ].map((s) => (
              <View key={s.label} style={{ alignItems: "center", gap: 2 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 15, textTransform: "capitalize" }}>
                  {s.value}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Appearance */}
        <View style={{
          backgroundColor: theme.bgCard, borderRadius: 24, marginHorizontal: 16,
          borderWidth: 0.5, borderColor: theme.border, overflow: "hidden",
        }}>
          <SectionLabel title="Appearance" />
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <ThemeToggle />
          </View>
        </View>

        {/* Account */}
        <View style={{
          backgroundColor: theme.bgCard, borderRadius: 24, marginHorizontal: 16, marginTop: 16,
          borderWidth: 0.5, borderColor: theme.border, overflow: "hidden",
        }}>
          <SectionLabel title="Account" />
          <Row icon={User}   Icon={User}   iconColor="#3b82f6" label="Edit profile"    onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <Row icon={Target} Icon={Target} iconColor="#f59e0b" label="Change goal"     onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <Row icon={Lock}   Icon={Lock}   iconColor="#8b5cf6" label="Change password" onPress={() => showToast("Coming soon", "info")} />
        </View>

        {/* Notifications */}
        <View style={{
          backgroundColor: theme.bgCard, borderRadius: 24, marginHorizontal: 16, marginTop: 16,
          borderWidth: 0.5, borderColor: theme.border, overflow: "hidden",
        }}>
          <SectionLabel title="Notifications" />
          <Row Icon={Bell}     iconColor="#ef4444" label="Workout reminders" toggle toggled={notifs}        onToggle={setNotifs} />
          <Divider />
          <Row Icon={Droplets} iconColor="#3b82f6" label="Water reminders"   toggle toggled={waterReminder} onToggle={setWaterReminder} />
        </View>

        {/* App */}
        <View style={{
          backgroundColor: theme.bgCard, borderRadius: 24, marginHorizontal: 16, marginTop: 16,
          borderWidth: 0.5, borderColor: theme.border, overflow: "hidden",
        }}>
          <SectionLabel title="App" />
          <Row Icon={Star}     iconColor="#f59e0b" label="Rate FitCoach"   onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <Row Icon={Mail}     iconColor="#22c55e" label="Contact support" onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <Row Icon={FileText} iconColor="#6b7280" label="Privacy policy"  onPress={() => showToast("Coming soon", "info")} />
          <Divider />
          <Row Icon={Info}     iconColor="#6b7280" label="Version"         value="1.0.0" />
        </View>

        {/* Sign out */}
        <View style={{
          backgroundColor: theme.bgCard, borderRadius: 24, marginHorizontal: 16, marginTop: 16,
          borderWidth: 0.5, borderColor: theme.border, overflow: "hidden",
        }}>
          <Row
            Icon={LogOut} iconColor={theme.error}
            label={isLoading ? "Signing out..." : "Sign out"}
            onPress={handleLogout}
            danger
          />
          <Divider />
          <Row
            Icon={Trash2} iconColor={theme.error}
            label="Delete account"
            onPress={handleDeleteAccount}
            danger
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
