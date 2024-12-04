export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          capacity: number | null
          price: number | null
          agoda_property_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          capacity?: number | null
          price?: number | null
          agoda_property_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          capacity?: number | null
          price?: number | null
          agoda_property_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 