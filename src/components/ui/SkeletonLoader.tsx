import React, { useEffect, useRef } from "react";
import { Animated, View, type ViewProps } from "react-native";

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
  ...props
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#1f1f1f",
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

// Pre-built skeleton layouts for common screens
export function WorkoutCardSkeleton() {
  return (
    <View className="bg-surface-card rounded-3xl p-4 gap-3 border border-surface-border">
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="40%" />
      <View className="flex-row gap-2 mt-2">
        <Skeleton height={32} width={80} borderRadius={16} />
        <Skeleton height={32} width={80} borderRadius={16} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View className="gap-4 p-4">
      <Skeleton height={28} width="50%" />
      <View className="flex-row gap-3">
        <View className="flex-1"><Skeleton height={90} borderRadius={16} /></View>
        <View className="flex-1"><Skeleton height={90} borderRadius={16} /></View>
      </View>
      <Skeleton height={160} borderRadius={20} />
      <Skeleton height={20} width="40%" />
      <WorkoutCardSkeleton />
      <WorkoutCardSkeleton />
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View className="items-center gap-4 p-6">
      <Skeleton width={88} height={88} borderRadius={44} />
      <Skeleton height={24} width={160} />
      <Skeleton height={16} width={120} />
      <View className="w-full gap-3 mt-4">
        <Skeleton height={56} borderRadius={16} />
        <Skeleton height={56} borderRadius={16} />
        <Skeleton height={56} borderRadius={16} />
      </View>
    </View>
  );
}
