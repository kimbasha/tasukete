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
      theaters: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      performances: {
        Row: {
          id: string
          theater_id: string
          title: string
          description: string | null
          venue: string
          area: string
          performance_date: string
          start_time: string
          poster_image_url: string | null
          available_tickets: number
          ticket_price: number
          reservation_url: string | null
          status: 'upcoming' | 'today' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          theater_id: string
          title: string
          description?: string | null
          venue: string
          area: string
          performance_date: string
          start_time: string
          poster_image_url?: string | null
          available_tickets: number
          ticket_price: number
          reservation_url?: string | null
          status?: 'upcoming' | 'today' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theater_id?: string
          title?: string
          description?: string | null
          venue?: string
          area?: string
          performance_date?: string
          start_time?: string
          poster_image_url?: string | null
          available_tickets?: number
          ticket_price?: number
          reservation_url?: string | null
          status?: 'upcoming' | 'today' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'performances_theater_id_fkey'
            columns: ['theater_id']
            isOneToOne: false
            referencedRelation: 'theaters'
            referencedColumns: ['id']
          }
        ]
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

// Helper types
export type Theater = Database['public']['Tables']['theaters']['Row']
export type Performance = Database['public']['Tables']['performances']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
