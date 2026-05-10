import React, { useState } from "react";
import {
  View, Text, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from "react-native";
import { Zap, Mail, Lock } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver }         from "@hookform/resolvers/zod";
import { z }                   from "zod";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList }  from "@/navigation/types";
import { useAuthStore }             from "@/stores/authStore";
import { useUIStore }               from "@/stores/uiStore";
import { useTheme }                 from "@/hooks/useTheme";
import { Button }                   from "@/components/ui/Button";
import { Input }                    from "@/components/ui/Input";
import { SocialAuthButtons }        from "@/components/ui/SocialAuthButtons";

const schema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export function LoginScreen({ navigation }: Props) {
  const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const { showToast } = useUIStore();
  const { theme }     = useTheme();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      showToast(err.message ?? "Sign in failed. Try again.", "error");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try { await signInWithGoogle(); }
    catch (err: any) { showToast(err.message ?? "Google sign in failed.", "error"); }
    finally { setGoogleLoading(false); }
  };

  const handleApple = async () => {
    setAppleLoading(true);
    try { await signInWithApple(); }
    catch (err: any) {
      if (err.code !== "ERR_REQUEST_CANCELED") {
        showToast(err.message ?? "Apple sign in failed.", "error");
      }
    }
    finally { setAppleLoading(false); }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bgPrimary }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, justifyContent: "space-between" }}>

          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              width: 52, height: 52, backgroundColor: theme.brand,
              borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Zap size={28} color="#fff" strokeWidth={2.5} />
            </View>
            <Text style={{ fontSize: 36, fontWeight: "700", color: theme.textPrimary, letterSpacing: -0.5 }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 17, color: theme.textMuted, marginTop: 6 }}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            {/* Social */}
            <SocialAuthButtons
              onGoogle={handleGoogle}
              onApple={handleApple}
              loadingGoogle={googleLoading}
              loadingApple={appleLoading}
              disabled={isLoading}
            />

            {/* Divider */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ flex: 1, height: 0.5, backgroundColor: theme.border }} />
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>or sign in with email</Text>
              <View style={{ flex: 1, height: 0.5, backgroundColor: theme.border }} />
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={20} color={theme.textMuted} />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Lock size={20} color={theme.textMuted} />}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={{ alignSelf: "flex-end" }}
            >
              <Text style={{ fontSize: 15, color: theme.brandLight }}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              label="Sign in"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              size="lg"
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
            <Text style={{ color: theme.textMuted, fontSize: 15 }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={{ color: theme.brandLight, fontSize: 15, fontWeight: "600" }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
