import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOffline }  = useNetworkStatus();
  const translateY     = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue:         isOffline ? 0 : -50,
      duration:        300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  return (
    <Animated.View
      style={{
        transform:       [{ translateY }],
        position:        "absolute",
        top:             0,
        left:            0,
        right:           0,
        zIndex:          9999,
        backgroundColor: "#854d0e",
        paddingVertical: 8,
        alignItems:      "center",
        flexDirection:   "row",
        justifyContent:  "center",
        gap:             8,
      }}
    >
      <Text style={{ fontSize: 14 }}>📡</Text>
      <Text style={{ color: "#fef08a", fontSize: 13, fontWeight: "500" }}>
        You're offline — some features may be unavailable
      </Text>
    </Animated.View>
  );
}
