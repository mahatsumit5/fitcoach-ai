import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView }       from "react-native-safe-area-context";
import { useProgressData }    from "@/hooks/useProgress";
import { useCoach }           from "@/hooks/useCoach";
import { useAuthStore }       from "@/stores/authStore";
import { ConsistencyHeatmap } from "@/components/charts/ConsistencyHeatmap";
import { WorkoutBarChart }    from "@/components/charts/WorkoutBarChart";
import { Skeleton }           from "@/components/ui/SkeletonLoader";

type MetricTab = "duration" | "calories";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View className="flex-1 bg-surface-secondary border border-surface-border rounded-2xl p-4">
      <Text className="text-brand-500 text-2xl font-bold">{value}</Text>
      {sub && <Text className="text-gray-400 text-xs mt-0.5">{sub}</Text>}
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  );
}

export function ProgressScreen() {
  const { profile }    = useAuthStore();
  const {
    workouts, workedOutDates, isLoading,
    streak, totalWorkouts30d, totalMinutes30d,
  } = useProgressData();
  const { sendMessage, isSending } = useCoach();
  const [activeTab, setActiveTab] = useState<MetricTab>("duration");
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleGetInsight = async () => {
    const msg = await sendMessage(
      `Look at my last 30 days: ${totalWorkouts30d} workouts, ${totalMinutes30d} total minutes, ${streak}-day streak. Give me a quick 2-sentence progress analysis.`
    );
    setAiInsight(msg ?? null);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-white text-2xl font-bold mb-6">Progress</Text>

        {/* Summary stats */}
        {isLoading ? (
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
            <View className="flex-1"><Skeleton height={80} borderRadius={16} /></View>
          </View>
        ) : (
          <View className="flex-row gap-3 mb-6">
            <StatCard label="Workouts (30d)" value={String(totalWorkouts30d)} />
            <StatCard label="Minutes (30d)"  value={String(totalMinutes30d)} />
            <StatCard label="Day streak" value={`${streak}🔥`} />
          </View>
        )}

        {/* Consistency heatmap */}
        {isLoading ? (
          <Skeleton height={200} borderRadius={20} />
        ) : (
          <ConsistencyHeatmap workedOutDates={workedOutDates} />
        )}

        {/* Bar chart */}
        <View className="mt-4">
          {/* Tab toggle */}
          <View className="flex-row gap-2 mb-3">
            {(["duration", "calories"] as MetricTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full border ${
                  activeTab === tab
                    ? "bg-brand-500 border-brand-500"
                    : "border-surface-border bg-surface-secondary"
                }`}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    activeTab === tab ? "text-white" : "text-gray-400"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? (
            <Skeleton height={160} borderRadius={20} />
          ) : workouts.length > 0 ? (
            <WorkoutBarChart data={workouts} metric={activeTab} />
          ) : (
            <View className="bg-surface-card border border-surface-border rounded-3xl p-8 items-center">
              <Text style={{ fontSize: 36 }}>📊</Text>
              <Text className="text-gray-400 text-sm mt-3 text-center">
                Complete workouts to see your progress charts
              </Text>
            </View>
          )}
        </View>

        {/* AI insight */}
        <View className="mt-4 bg-surface-card border border-surface-border rounded-3xl p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Text style={{ fontSize: 20 }}>🤖</Text>
            <Text className="text-white font-semibold">AI Progress Analysis</Text>
          </View>

          {aiInsight ? (
            <Text className="text-gray-300 text-sm leading-6">{aiInsight}</Text>
          ) : (
            <Text className="text-gray-500 text-sm mb-3">
              Get a personalised analysis of your recent progress from your AI coach.
            </Text>
          )}

          <TouchableOpacity
            onPress={handleGetInsight}
            disabled={isSending}
            className={`mt-3 py-3 rounded-2xl items-center flex-row justify-center gap-2 ${
              isSending ? "bg-surface-tertiary" : "bg-brand-500"
            }`}
          >
            {isSending ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold text-sm">Analysing...</Text>
              </>
            ) : (
              <Text className="text-white font-semibold text-sm">
                {aiInsight ? "Refresh analysis" : "Analyse my progress"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Personal records placeholder */}
        <View className="mt-4 bg-surface-card border border-surface-border rounded-3xl p-4">
          <Text className="text-white font-semibold mb-3">Personal records</Text>
          {totalWorkouts30d === 0 ? (
            <Text className="text-gray-500 text-sm">
              Complete workouts to track your personal records.
            </Text>
          ) : (
            <Text className="text-gray-500 text-sm">
              Strength tracking coming in a future update.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
