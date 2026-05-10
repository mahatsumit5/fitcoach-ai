import React from "react";
import { View, Text } from "react-native";
import type { ChatMessage } from "@/types";
import { formatTime } from "@/utils/formatting";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <View
      className={`flex-row mb-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-brand-500 items-center justify-center mr-2 mt-1 shrink-0">
          <Text style={{ fontSize: 14 }}>⚡</Text>
        </View>
      )}

      <View style={{ maxWidth: "78%" }}>
        <View
          className={`px-4 py-3 rounded-3xl ${
            isUser
              ? "bg-brand-500 rounded-br-lg"
              : "bg-surface-secondary border border-surface-border rounded-bl-lg"
          }`}
        >
          <Text
            className={`text-sm leading-5 ${
              isUser ? "text-white" : "text-gray-200"
            }`}
          >
            {message.content}
          </Text>
        </View>
        <Text className={`text-xs text-gray-600 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
