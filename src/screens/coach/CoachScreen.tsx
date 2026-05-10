import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCoach }      from "@/hooks/useCoach";
import { useCoachStore } from "@/stores/coachStore";
import { useAuthStore }  from "@/stores/authStore";
import { ChatBubble }        from "@/components/coach/ChatBubble";
import { TypingIndicator }   from "@/components/coach/TypingIndicator";
import { SuggestedPrompts }  from "@/components/coach/SuggestedPrompts";
import { WorkoutPlanCard }   from "@/components/coach/WorkoutPlanCard";
import type { ChatMessage }  from "@/types";

type QuickAction = {
  label: string;
  icon:  string;
  action: () => void;
};

export function CoachScreen() {
  const { profile }   = useAuthStore();
  const { messages, isTyping }  = useCoachStore();
  const {
    sendMessage, isSending,
    generateWorkoutPlan, isGeneratingPlan, generatedPlan,
  } = useCoach();

  const [inputText, setInputText] = useState("");
  const [showActions, setShowActions] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isTyping]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? inputText).trim();
    if (!msg || isSending) return;
    setInputText("");
    setShowActions(false);
    await sendMessage(msg);
  };

  const quickActions: QuickAction[] = [
    {
      label:  "Generate workout plan",
      icon:   "🏋️",
      action: async () => {
        setShowActions(false);
        await generateWorkoutPlan();
      },
    },
    {
      label:  "What should I eat today?",
      icon:   "🥗",
      action: () => handleSend("What should I eat today to support my fitness goal?"),
    },
    {
      label:  "Analyse my progress",
      icon:   "📊",
      action: () => handleSend("Can you analyse my recent progress and give me feedback?"),
    },
    {
      label:  "Recovery advice",
      icon:   "😴",
      action: () => handleSend("Should I train today or rest? Give me recovery advice."),
    },
  ];

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-primary" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-border">
          <View>
            <Text className="text-white text-lg font-bold">AI Coach</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-brand-500" />
              <Text className="text-gray-400 text-xs">FitCoach AI · Online</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => useCoachStore.getState().clearHistory()}
            className="bg-surface-secondary border border-surface-border rounded-xl px-3 py-1.5"
          >
            <Text className="text-gray-400 text-xs">Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            showActions ? (
              <View className="flex-1 justify-center">
                {/* Welcome */}
                <View className="items-center mb-8 mt-4">
                  <View className="w-16 h-16 rounded-full bg-brand-500 items-center justify-center mb-4">
                    <Text style={{ fontSize: 30 }}>⚡</Text>
                  </View>
                  <Text className="text-white text-xl font-bold text-center">
                    Hey {profile?.display_name ?? "there"}!
                  </Text>
                  <Text className="text-gray-400 text-sm text-center mt-2 leading-5">
                    I'm your AI fitness coach. Ask me anything about{"\n"}workouts, nutrition, or your progress.
                  </Text>
                </View>

                {/* Quick action cards */}
                <View className="gap-3">
                  {quickActions.map((action) => (
                    <TouchableOpacity
                      key={action.label}
                      onPress={action.action}
                      disabled={isGeneratingPlan}
                      className="flex-row items-center gap-4 bg-surface-secondary border border-surface-border rounded-2xl p-4"
                    >
                      <Text style={{ fontSize: 24 }}>{action.icon}</Text>
                      <Text className="text-white font-medium flex-1">{action.label}</Text>
                      {isGeneratingPlan && action.icon === "🏋️" ? (
                        <ActivityIndicator size="small" color="#22c55e" />
                      ) : (
                        <Text className="text-gray-600">›</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null
          }
          ListFooterComponent={
            <>
              {isTyping && <TypingIndicator />}
              {/* Generated workout plan */}
              {generatedPlan && (
                <View className="mt-2">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-8 h-8 rounded-full bg-brand-500 items-center justify-center">
                      <Text style={{ fontSize: 14 }}>⚡</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">Here's your personalised plan:</Text>
                  </View>
                  <WorkoutPlanCard plan={generatedPlan} />
                </View>
              )}
            </>
          }
        />

        {/* Suggested prompts */}
        {messages.length > 0 && !isSending && (
          <SuggestedPrompts onSelect={(p) => handleSend(p)} />
        )}

        {/* Input bar */}
        <View className="flex-row items-end gap-2 px-4 py-3 border-t border-surface-border">
          <View className="flex-1 bg-surface-secondary border border-surface-border rounded-3xl px-4 py-3 min-h-12 max-h-32 justify-center">
            <TextInput
              className="text-white text-base"
              placeholder="Ask your coach anything..."
              placeholderTextColor="#4b5563"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => handleSend()}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isSending}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !isSending ? "bg-brand-500" : "bg-surface-tertiary"
            }`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-lg">↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
