import React from "react";
import { View, Text } from "react-native";

interface ConsistencyHeatmapProps {
  workedOutDates: string[]; // ISO date strings "YYYY-MM-DD"
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function ConsistencyHeatmap({ workedOutDates }: ConsistencyHeatmapProps) {
  const dateSet = new Set(workedOutDates);

  // Build last 35 days in a 5-week grid
  const days: { date: string; hasWorkout: boolean; isToday: boolean; isFuture: boolean }[] = [];
  const today  = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the start of the week 5 weeks ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 34);
  // Align to Monday
  const dayOfWeek = (startDate.getDay() + 6) % 7; // 0=Mon
  startDate.setDate(startDate.getDate() - dayOfWeek);

  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key    = d.toISOString().split("T")[0];
    const isToday  = key === today.toISOString().split("T")[0];
    const isFuture = d > today;
    days.push({ date: key, hasWorkout: dateSet.has(key), isToday, isFuture });
  }

  const weeks: typeof days[] = [];
  for (let i = 0; i < 5; i++) weeks.push(days.slice(i * 7, i * 7 + 7));

  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl p-4">
      <Text className="text-white font-semibold mb-3">Consistency — last 5 weeks</Text>

      {/* Day labels */}
      <View className="flex-row gap-1.5 mb-1.5 ml-0">
        {DAY_LABELS.map((d, i) => (
          <View key={i} style={{ width: 32 }}>
            <Text className="text-gray-600 text-xs text-center">{d}</Text>
          </View>
        ))}
      </View>

      {/* Grid — rows are weeks, columns are days */}
      {weeks.map((week, wIdx) => (
        <View key={wIdx} className="flex-row gap-1.5 mb-1.5">
          {week.map((day, dIdx) => (
            <View
              key={dIdx}
              style={{
                width:           32,
                height:          32,
                borderRadius:    8,
                backgroundColor: day.isFuture
                  ? "transparent"
                  : day.hasWorkout
                  ? "#22c55e"
                  : day.isToday
                  ? "#1f2d1f"
                  : "#1f1f1f",
                borderWidth:     day.isToday ? 1 : 0,
                borderColor:     "#22c55e",
                opacity:         day.isFuture ? 0.2 : 1,
              }}
            />
          ))}
        </View>
      ))}

      {/* Legend */}
      <View className="flex-row items-center gap-2 mt-2">
        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#1f1f1f" }} />
        <Text className="text-gray-600 text-xs">Rest</Text>
        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#22c55e" }} />
        <Text className="text-gray-600 text-xs">Workout</Text>
      </View>
    </View>
  );
}
