
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
      shops: {
        Row: {
          id: string
          name: string
          owner_id: string
          address: string | null
          upi_id: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          address?: string | null
          upi_id?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          address?: string | null
          upi_id?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          role: "shopkeeper" | "customer"
          shop_id: string | null
          customer_id: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          role: "shopkeeper" | "customer"
          shop_id?: string | null
          customer_id?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: "shopkeeper" | "customer"
          shop_id?: string | null
          customer_id?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          unique_id: string
          phone: string | null
          email: string | null
          shop_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          unique_id: string
          phone?: string | null
          email?: string | null
          shop_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          unique_id?: string
          phone?: string | null
          email?: string | null
          shop_id?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          customer_id: string
          shop_id: string
          amount: number
          description: string
          is_pending: boolean
          items: string[] | null
          created_at: string
          paid_at: string | null
          due_date: string | null
          transaction_id: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          shop_id: string
          amount: number
          description: string
          is_pending: boolean
          items?: string[] | null
          created_at?: string
          paid_at?: string | null
          due_date?: string | null
          transaction_id?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          shop_id?: string
          amount?: number
          description?: string
          is_pending?: boolean
          items?: string[] | null
          created_at?: string
          paid_at?: string | null
          due_date?: string | null
          transaction_id?: string | null
        }
      }
    }
  }
}
