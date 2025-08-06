import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          color: string
          due_date: string
          completed: boolean
          calendar_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          color: string
          due_date: string
          completed?: boolean
          calendar_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          color?: string
          due_date?: string
          completed?: boolean
          calendar_id?: string | null
          updated_at?: string
        }
      }
    }
  }
}

// Tipo para las tareas
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
