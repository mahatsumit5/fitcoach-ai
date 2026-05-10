import { create } from "zustand";
import type { ToastType } from "@/types";

interface UIState {
  toastMessage: string | null;
  toastType: ToastType;
  isTabBarVisible: boolean;

  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  setTabBarVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toastMessage: null,
  toastType: "info",
  isTabBarVisible: true,

  showToast: (message, type = "info") => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null }), 3500);
  },

  hideToast: () => set({ toastMessage: null }),

  setTabBarVisible: (visible) => set({ isTabBarVisible: visible }),
}));
