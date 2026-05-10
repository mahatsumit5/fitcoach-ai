import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore }  from "@/stores/authStore";
import { useCoachStore } from "@/stores/coachStore";
import { useUIStore }    from "@/stores/uiStore";
import { callClaude, callClaudeJSON, saveAiMessage } from "@/api/claude";
import { buildCoachSystemPrompt }   from "@/prompts/coach";
import { buildWorkoutPlanPrompt }   from "@/prompts/workout";
import { buildMealPlanPrompt, buildMacroTargetPrompt } from "@/prompts/nutrition";
import { buildProgressSummaryPrompt } from "@/prompts/coach";
import type { GeneratedWorkoutPlan, GeneratedMealPlan, Profile } from "@/types";

export function useCoach() {
  const { user, profile }                 = useAuthStore();
  const { messages, addMessage, setTyping } = useCoachStore();
  const { showToast }                     = useUIStore();

  const systemPrompt = profile
    ? buildCoachSystemPrompt(profile)
    : "You are FitCoach AI, a helpful personal trainer.";

  // Send a conversational message
  const sendMessage = useMutation({
    mutationFn: async (userText: string) => {
      if (!user || !profile) throw new Error("Not authenticated");

      // Add user message to UI immediately
      addMessage({ role: "user", content: userText });
      setTyping(true);

      // Build message history for context (last 10 messages)
      const history = messages.slice(-10).map((m) => ({
        role:    m.role,
        content: m.content,
      }));

      const reply = await callClaude({
        system:   systemPrompt,
        messages: [...history, { role: "user", content: userText }],
      });

      // Persist both messages
      await saveAiMessage({ profileId: user.id, role: "user",      content: userText, contextType: "general" });
      await saveAiMessage({ profileId: user.id, role: "assistant", content: reply,    contextType: "general" });

      return reply;
    },
    onSuccess: (reply) => {
      addMessage({ role: "assistant", content: reply });
    },
    onError: () => {
      showToast("Coach is unavailable right now. Try again.", "error");
    },
    onSettled: () => {
      setTyping(false);
    },
  });

  // Generate a full workout plan
  const generateWorkoutPlan = useMutation({
    mutationFn: async (): Promise<GeneratedWorkoutPlan> => {
      if (!profile) throw new Error("Profile not loaded");
      const prompt = buildWorkoutPlanPrompt(profile);
      return callClaudeJSON<GeneratedWorkoutPlan>({
        system:     "You are FitCoach AI. Respond only with valid JSON matching the requested schema.",
        messages:   [{ role: "user", content: prompt }],
        max_tokens: 2048,
      });
    },
    onError: () => showToast("Failed to generate plan. Try again.", "error"),
  });

  // Generate a meal plan
  const generateMealPlan = useMutation({
    mutationFn: async (targetCalories: number): Promise<GeneratedMealPlan> => {
      if (!profile) throw new Error("Profile not loaded");
      const prompt = buildMealPlanPrompt(profile, targetCalories);
      return callClaudeJSON<GeneratedMealPlan>({
        system:   "You are FitCoach AI. Respond only with valid JSON matching the requested schema.",
        messages: [{ role: "user", content: prompt }],
      });
    },
    onError: () => showToast("Failed to generate meal plan. Try again.", "error"),
  });

  // Get macro targets
  const getMacroTargets = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profile not loaded");
      const prompt = buildMacroTargetPrompt(profile);
      return callClaudeJSON<{
        calories: number; protein_g: number; carbs_g: number;
        fat_g: number; water_ml: number; reasoning: string;
      }>({
        system:   "You are FitCoach AI. Respond only with valid JSON.",
        messages: [{ role: "user", content: prompt }],
      });
    },
    onError: () => showToast("Failed to calculate targets. Try again.", "error"),
  });

  return {
    messages,
    sendMessage:        sendMessage.mutateAsync,
    isSending:          sendMessage.isPending,
    generateWorkoutPlan: generateWorkoutPlan.mutateAsync,
    isGeneratingPlan:   generateWorkoutPlan.isPending,
    generatedPlan:      generateWorkoutPlan.data,
    generateMealPlan:   generateMealPlan.mutateAsync,
    isGeneratingMeal:   generateMealPlan.isPending,
    generatedMeal:      generateMealPlan.data,
    getMacroTargets:    getMacroTargets.mutateAsync,
    macroTargets:       getMacroTargets.data,
  };
}
