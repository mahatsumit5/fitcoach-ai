import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore }   from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Input }  from "@/components/ui/Input";

const schema = z
  .object({
    email:           z.string().email("Enter a valid email address"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export function RegisterScreen({ navigation }: Props) {
  const { signUp, isLoading } = useAuthStore();
  const { showToast } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await signUp(data.email, data.password);
      showToast("Account created! Check your email to verify.", "success");
    } catch (err: any) {
      showToast(err.message ?? "Sign up failed. Try again.", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-10">
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8"
          >
            <Text className="text-gray-400 text-base">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="gap-2 mb-10">
            <Text className="text-4xl font-bold text-white tracking-tight">
              Create account
            </Text>
            <Text className="text-base text-gray-400">
              Start your AI-powered fitness journey today
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
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
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="Min. 8 characters"
                  isPassword
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Confirm password"
                  placeholder="Repeat your password"
                  isPassword
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Text className="text-xs text-gray-500 mt-1 leading-5">
              By creating an account you agree to our{" "}
              <Text className="text-brand-400">Terms of Service</Text> and{" "}
              <Text className="text-brand-400">Privacy Policy</Text>.
            </Text>

            <View className="mt-2">
              <Button
                label="Create account"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center gap-2 mt-8">
            <Text className="text-gray-500 text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-brand-400 text-sm font-semibold">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
