import React, { useState } from "react";
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

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "ForgotPassword">;
};

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword } = useAuthStore();
  const { showToast }     = useUIStore();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setSubmitted(true);
    } catch (err: any) {
      showToast(err.message ?? "Could not send reset email. Try again.", "error");
    } finally {
      setIsLoading(false);
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
      >
        <View className="flex-1 px-6 pt-16 pb-10">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
            <Text className="text-gray-400 text-base">← Back</Text>
          </TouchableOpacity>

          {submitted ? (
            /* Success state */
            <View className="flex-1 justify-center items-center gap-4">
              <View className="w-16 h-16 bg-brand-900 rounded-full items-center justify-center">
                <Text className="text-3xl">✓</Text>
              </View>
              <Text className="text-2xl font-bold text-white text-center">
                Check your inbox
              </Text>
              <Text className="text-gray-400 text-center leading-6">
                We've sent a password reset link to your email address.
              </Text>
              <Button
                label="Back to sign in"
                variant="outline"
                onPress={() => navigation.navigate("Login")}
                className="mt-4"
              />
            </View>
          ) : (
            /* Form state */
            <View className="gap-2">
              <Text className="text-4xl font-bold text-white tracking-tight mb-2">
                Reset password
              </Text>
              <Text className="text-base text-gray-400 mb-8">
                Enter your email and we'll send you a reset link.
              </Text>

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

              <View className="mt-4">
                <Button
                  label="Send reset link"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
