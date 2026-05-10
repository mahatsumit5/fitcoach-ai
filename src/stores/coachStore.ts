import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface CoachState {
  messages:    ChatMessage[];
  isTyping:    boolean;
  addMessage:  (msg: Omit<ChatMessage, "id" | "createdAt">) => void;
  setTyping:   (typing: boolean) => void;
  clearHistory: () => void;
}

export const useCoachStore = create<CoachState>((set) => ({
  messages:  [],
  isTyping:  false,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id:        `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  clearHistory: () => set({ messages: [] }),
}));
