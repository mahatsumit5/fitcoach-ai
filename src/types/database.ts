export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          age: number | null;
          weight_kg: number | null;
          height_cm: number | null;
          fitness_goal: string | null;
          experience_level: string | null;
          dietary_prefs: string[] | null;
          injuries: string[] | null;
          days_per_week: number | null;
          equipment: string | null;
          push_token: string | null;
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["profiles"]["Insert"]
        >;
      };
      workout_sessions: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          duration_seconds: number | null;
          calories_burned: number | null;
          completed: boolean;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["workout_sessions"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["workout_sessions"]["Insert"]
        >;
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group: string;
          equipment: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          instructions: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["exercises"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["exercises"]["Insert"]
        >;
      };
      nutrition_logs: {
        Row: {
          id: string;
          profile_id: string;
          meal_name: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          logged_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["nutrition_logs"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["nutrition_logs"]["Insert"]
        >;
      };
      ai_messages: {
        Row: {
          id: string;
          profile_id: string;
          role: "user" | "assistant";
          content: string;
          context_type: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ai_messages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["ai_messages"]["Insert"]
        >;
      };
      water_logs: {
        Row: {
          id: string;
          profile_id: string;
          amount_ml: number;
          logged_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["water_logs"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["water_logs"]["Insert"]
        >;
      };
    };
  };
}
