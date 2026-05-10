import React, { Component, type ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children:  ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError:   boolean;
  error:      Error | null;
  errorInfo:  string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ errorInfo: info.componentStack ?? null });
    // In production, send to error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#0a0a0a" }}
          edges={["top"]}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
              <Text style={{ fontSize: 48 }}>⚠️</Text>

              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "600", textAlign: "center" }}>
                Something went wrong
              </Text>

              <Text style={{ color: "#6b7280", fontSize: 14, textAlign: "center", lineHeight: 22 }}>
                FitCoach ran into an unexpected error. Your data is safe.
              </Text>

              {__DEV__ && this.state.error && (
                <View
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: 12,
                    padding: 16,
                    width: "100%",
                    borderWidth: 0.5,
                    borderColor: "#ef4444",
                  }}
                >
                  <Text style={{ color: "#ef4444", fontSize: 12, fontFamily: "monospace" }}>
                    {this.state.error.message}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={{ color: "#6b7280", fontSize: 11, marginTop: 8, fontFamily: "monospace" }}>
                      {this.state.errorInfo.slice(0, 400)}
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                onPress={this.handleReset}
                style={{
                  backgroundColor: "#22c55e",
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  borderRadius: 16,
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Lightweight screen-level error fallback
export function ScreenErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 36 }}>😵</Text>
      <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
        Failed to load
      </Text>
      <Text style={{ color: "#6b7280", fontSize: 14, textAlign: "center" }}>
        Pull down to refresh or tap retry.
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            borderWidth: 1,
            borderColor: "#22c55e",
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#22c55e", fontWeight: "600" }}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
