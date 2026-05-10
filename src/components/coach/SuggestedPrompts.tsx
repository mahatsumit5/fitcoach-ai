import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { SUGGESTED_PROMPTS } from "@/prompts/coach";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
    >
      {SUGGESTED_PROMPTS.map((prompt) => (
        <TouchableOpacity
          key={prompt}
          onPress={() => onSelect(prompt)}
          className="bg-surface-secondary border border-surface-border rounded-full px-4 py-2"
        >
          <Text className="text-gray-300 text-sm">{prompt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
