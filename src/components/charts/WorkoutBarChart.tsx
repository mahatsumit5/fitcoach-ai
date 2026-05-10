import React from "react";
import { View, Text } from "react-native";
import type { WorkoutDataPoint } from "@/api/progress";

interface WorkoutBarChartProps {
  data:   WorkoutDataPoint[];
  metric: "duration" | "calories";
}

export function WorkoutBarChart({ data, metric }: WorkoutBarChartProps) {
  const values = data.map((d) =>
    metric === "duration" ? Math.round(d.duration_seconds / 60) : (d.calories_burned ?? 0)
  );
  const maxVal = Math.max(...values, 1);
  const unit   = metric === "duration" ? "min" : "kcal";

  // Show last 7 entries
  const recent    = data.slice(-7);
  const recentVals = values.slice(-7);

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl p-4">
      <Text className="text-white font-semibold mb-4">
        {metric === "duration" ? "Session duration" : "Calories burned"} — last 7 workouts
      </Text>

      <View className="flex-row items-end justify-between" style={{ height: 100 }}>
        {recentVals.map((val, i) => {
          const barH = maxVal > 0 ? Math.max((val / maxVal) * 88, 4) : 4;
          const date = recent[i]?.date ?? "";
          const label = date ? new Date(date).toLocaleDateString("en-AU", { weekday: "narrow" }) : "";

          return (
            <View key={i} className="items-center gap-1" style={{ flex: 1 }}>
              <Text className="text-gray-500 text-xs">{val > 0 ? val : ""}</Text>
              <View
                style={{
                  height:          barH,
                  width:           "70%",
                  backgroundColor: val > 0 ? "#22c55e" : "#1f1f1f",
                  borderRadius:    4,
                  opacity:         0.7 + (i / recentVals.length) * 0.3,
                }}
              />
              <Text className="text-gray-600 text-xs">{label}</Text>
            </View>
          );
        })}
      </View>

      <Text className="text-gray-600 text-xs mt-2 text-right">{unit}</Text>
    </View>
  );
}
