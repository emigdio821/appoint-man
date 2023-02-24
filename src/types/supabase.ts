export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          attendees: Json[]
          created_at: string
          description: string
          ends_in: string
          id: number
          organizer: string
          summary: string
        }
        Insert: {
          attendees: Json[]
          created_at?: string
          description: string
          ends_in?: string
          id?: number
          organizer?: string
          summary: string
        }
        Update: {
          attendees?: Json[]
          created_at?: string
          description?: string
          ends_in?: string
          id?: number
          organizer?: string
          summary?: string
        }
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
      }
      roles: {
        Row: {
          id: number
          role: string
        }
        Insert: {
          id?: number
          role?: string
        }
        Update: {
          id?: number
          role?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

