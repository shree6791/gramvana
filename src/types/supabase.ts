export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          dietaryPreferences: string[]
          healthGoals: string
          allergies: string[]
          enableMealPlanning: boolean
          bodyWeight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          dietaryPreferences?: string[]
          healthGoals?: string
          allergies?: string[]
          enableMealPlanning?: boolean
          bodyWeight?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          dietaryPreferences?: string[]
          healthGoals?: string
          allergies?: string[]
          enableMealPlanning?: boolean
          bodyWeight?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}