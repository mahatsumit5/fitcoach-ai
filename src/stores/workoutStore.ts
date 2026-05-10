import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ActiveWorkoutSession, ActiveExercise, SetLog } from "@/types";
import * as ExpoCrypto from "expo-crypto";
interface WorkoutState {
  activeSession: ActiveWorkoutSession | null;
  elapsedSeconds: number;

  startSession: (name: string, exercises: ActiveExercise[]) => void;
  logSet: (exerciseId: string, set: SetLog) => void;
  updateSet: (
    exerciseId: string,
    setIndex: number,
    set: Partial<SetLog>,
  ) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  addExercise: (exercise: ActiveExercise) => void;
  removeExercise: (exerciseId: string) => void;
  tickTimer: () => void;
  resetTimer: () => void;
  completeSession: () => ActiveWorkoutSession | null;
  abandonSession: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      elapsedSeconds: 0,

      startSession: (name, exercises) => {
        set({
          activeSession: {
            id: ExpoCrypto.randomUUID(),
            name,
            startedAt: new Date().toISOString(),
            exercises,
            completed: false,
          },
          elapsedSeconds: 0,
        });
      },

      logSet: (exerciseId, newSet) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? { ...ex, sets_logged: [...ex.sets_logged, newSet] }
                  : ex,
              ),
            },
          };
        });
      },

      updateSet: (exerciseId, setIndex, updated) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets_logged: ex.sets_logged.map((s, i) =>
                        i === setIndex ? { ...s, ...updated } : s,
                      ),
                    }
                  : ex,
              ),
            },
          };
        });
      },

      removeSet: (exerciseId, setIndex) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets_logged: ex.sets_logged.filter(
                        (_, i) => i !== setIndex,
                      ),
                    }
                  : ex,
              ),
            },
          };
        });
      },

      addExercise: (exercise) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: [...state.activeSession.exercises, exercise],
            },
          };
        });
      },

      removeExercise: (exerciseId) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.filter(
                (ex) => ex.id !== exerciseId,
              ),
            },
          };
        });
      },

      tickTimer: () =>
        set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

      resetTimer: () => set({ elapsedSeconds: 0 }),

      completeSession: () => {
        const session = get().activeSession;
        if (!session) return null;
        const completed = { ...session, completed: true };
        set({ activeSession: null, elapsedSeconds: 0 });
        return completed;
      },

      abandonSession: () => set({ activeSession: null, elapsedSeconds: 0 }),
    }),
    {
      name: "workout-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeSession: state.activeSession,
        elapsedSeconds: state.elapsedSeconds,
      }),
    },
  ),
);
