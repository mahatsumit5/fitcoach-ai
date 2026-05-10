import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View className="flex-row items-center mb-3">
      <View className="w-8 h-8 rounded-full bg-brand-500 items-center justify-center mr-2 shrink-0">
        <Animated.Text style={{ fontSize: 14 }}>⚡</Animated.Text>
      </View>
      <View className="bg-surface-secondary border border-surface-border rounded-3xl rounded-bl-lg px-4 py-3 flex-row gap-1 items-center">
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            style={{
              width:           8,
              height:          8,
              borderRadius:    4,
              backgroundColor: "#22c55e",
              opacity:         dot,
              transform: [{
                scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
              }],
            }}
          />
        ))}
      </View>
    </View>
  );
}
