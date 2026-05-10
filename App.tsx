import "./global.css";
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient }   from "@/lib/queryClient";
import { RootNavigator } from "@/navigation/RootNavigator";
import { Toast }         from "@/components/ui/Toast";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useTheme }      from "@/hooks/useTheme";

function ThemedApp() {
  const { theme, isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? "light" : "dark"} backgroundColor={theme.bgPrimary} />
        <RootNavigator />
        <Toast />
        <OfflineBanner />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemedApp />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
