import React from "react";
import { View, Text } from "react-native";

export function NutritionScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600" }}>Nutrition</Text>
      <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>Coming in Sprint 2</Text>
    </View>
  );
}
