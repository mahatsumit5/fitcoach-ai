import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Flame, Dumbbell, Timer, Droplets, ChevronRight,
} from "lucide-react-native";
import { useAuthStore }    from "@/stores/authStore";
import { useWeeklyStats }  from "@/hooks/useWorkout";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useTheme }        from "@/hooks/useTheme";
import { WorkoutTimer }    from "@/components/workout/WorkoutTimer";
import { Skeleton }        from "@/components/ui/SkeletonLoader";
import { formatDurationLong } from "@/utils/formatting";

function StatCard({ label, value, Icon, iconColor }: {
  label: string; value: string; Icon: any; iconColor: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={{
      flex: 1, backgroundColor: theme.bgCard,
      borderRadius: 20, padding: 16,
      borderWidth: 0.5, borderColor: theme.border,
    }}>
      <Icon size={22} color={iconColor} strokeWidth={2} />
      <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "700", marginTop: 8 }}>
        {value}
      </Text>
      <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const QUICK_WORKOUTS = [
  { name: "Push Day",  Icon: Dumbbell, desc: "Chest · Shoulders · Triceps · 45 min",  color: "#3b82f6" },
  { name: "Pull Day",  Icon: Dumbbell, desc: "Back · Biceps · 45 min",                color: "#8b5cf6" },
  { name: "Leg Day",   Icon: Dumbbell, desc: "Quads · Hamstrings · Glutes · 50 min",  color: "#f59e0b" },
  { name: "Full Body", Icon: Flame,    desc: "All muscle groups · 60 min",            color: "#ef4444" },
];

export function DashboardScreen() {
  const { profile }      = useAuthStore();
  const { data: stats, isLoading } = useWeeklyStats();
  const { activeSession, elapsedSeconds } = useWorkoutStore();
  const { theme }        = useTheme();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgPrimary }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 15 }}>{greeting()}</Text>
            <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "700", marginTop: 2 }}>
              {profile?.display_name ?? "Athlete"} 👋
            </Text>
          </View>
          <View style={{
            width: 46, height: 46, borderRadius: 23,
            backgroundColor: theme.brand, alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
              {profile?.display_name?.[0]?.toUpperCase() ?? "A"}
            </Text>
          </View>
        </View>

        {/* Active session banner */}
        {activeSession && (
          <View style={{
            backgroundColor: theme.brandBg, borderWidth: 1, borderColor: theme.brand,
            borderRadius: 24, padding: 16, marginBottom: 20,
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          }}>
            <View>
              <Text style={{ color: theme.brandLight, fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 }}>
                Active workout
              </Text>
              <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 17, marginTop: 4 }}>
                {activeSession.name}
              </Text>
            </View>
            <WorkoutTimer seconds={elapsedSeconds} size="sm" />
          </View>
        )}

        {/* Weekly stats */}
        <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          This week
        </Text>
        {isLoading ? (
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            {[1,2,3].map(i => <View key={i} style={{ flex: 1 }}><Skeleton height={90} borderRadius={20} /></View>)}
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <StatCard label="Workouts" value={String(stats?.count ?? 0)}         Icon={Dumbbell} iconColor="#22c55e" />
            <StatCard label="Minutes"  value={String(stats?.totalMinutes ?? 0)}  Icon={Timer}    iconColor="#3b82f6" />
            <StatCard label="Calories" value={String(stats?.totalCalories ?? 0)} Icon={Flame}    iconColor="#f59e0b" />
          </View>
        )}

        {/* Quick start */}
        <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Quick start
        </Text>
        <View style={{ gap: 12 }}>
          {QUICK_WORKOUTS.map((w) => (
            <TouchableOpacity
              key={w.name}
              style={{
                backgroundColor: theme.bgCard, borderRadius: 24,
                borderWidth: 0.5, borderColor: theme.border,
                padding: 16, flexDirection: "row", alignItems: "center", gap: 16,
              }}
            >
              <View style={{
                width: 48, height: 48, borderRadius: 16,
                backgroundColor: theme.bgTertiary, alignItems: "center", justifyContent: "center",
              }}>
                <w.Icon size={24} color={w.color} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 17 }}>{w.name}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 14, marginTop: 2 }}>{w.desc}</Text>
              </View>
              <ChevronRight size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
