import React from "react";
import {
  View, Text, TouchableOpacity, ActivityIndicator, Platform,
} from "react-native";

interface SocialButtonProps {
  provider:  "google" | "apple";
  onPress:   () => void;
  loading?:  boolean;
  disabled?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    label: "Continue with Google",
    icon:  "G",
    bg:    "#ffffff",
    text:  "#1f1f1f",
    border:"#e5e7eb",
    iconBg:"transparent",
    iconColor: "#1f1f1f",
  },
  apple: {
    label: "Continue with Apple",
    icon:  "",
    bg:    "#ffffff",
    text:  "#1f1f1f",
    border:"#e5e7eb",
    iconBg:"transparent",
    iconColor: "#1f1f1f",
  },
};

export function SocialButton({ provider, onPress, loading, disabled }: SocialButtonProps) {
  const config     = PROVIDER_CONFIG[provider];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={{
        flexDirection:  "row",
        alignItems:     "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        borderWidth:    0.5,
        borderColor:    "#2a2a2a",
        borderRadius:   16,
        height:         52,
        gap:            10,
        opacity:        isDisabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#9ca3af" />
      ) : (
        <>
          {provider === "google" ? (
            // Google "G" logo using coloured letters
            <View
              style={{
                width:           24,
                height:          24,
                borderRadius:    12,
                backgroundColor: "#fff",
                alignItems:      "center",
                justifyContent:  "center",
              }}
            >
              <Text
                style={{
                  fontSize:   13,
                  fontWeight: "700",
                  color:      "#4285F4",
                }}
              >
                G
              </Text>
            </View>
          ) : (
            // Apple logo
            <Text style={{ fontSize: 20, color: "#ffffff", lineHeight: 24 }}>
              
            </Text>
          )}
          <Text
            style={{
              color:      "#ffffff",
              fontSize:   15,
              fontWeight: "500",
            }}
          >
            {config.label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

interface SocialAuthButtonsProps {
  onGoogle:       () => void;
  onApple:        () => void;
  loadingGoogle?: boolean;
  loadingApple?:  boolean;
  disabled?:      boolean;
}

export function SocialAuthButtons({
  onGoogle, onApple,
  loadingGoogle, loadingApple,
  disabled,
}: SocialAuthButtonsProps) {
  return (
    <View style={{ gap: 12 }}>
      {/* Divider */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1, height: 0.5, backgroundColor: "#2a2a2a" }} />
        <Text style={{ color: "#4b5563", fontSize: 13 }}>or continue with</Text>
        <View style={{ flex: 1, height: 0.5, backgroundColor: "#2a2a2a" }} />
      </View>

      {/* Google — available on both platforms */}
      <SocialButton
        provider="google"
        onPress={onGoogle}
        loading={loadingGoogle}
        disabled={disabled}
      />

      {/* Apple — iOS only */}
      {Platform.OS === "ios" && (
        <SocialButton
          provider="apple"
          onPress={onApple}
          loading={loadingApple}
          disabled={disabled}
        />
      )}
    </View>
  );
}
