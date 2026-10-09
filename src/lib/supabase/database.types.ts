export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adoption_requests: {
        Row: {
          address: string | null
          confirm_allergies: boolean | null
          confirm_attention: boolean | null
          confirm_food: boolean | null
          confirm_safe: boolean
          confirm_vet: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          occupation: string | null
          pet_id: string
          phone: string | null
          reason: string | null
          shelter_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          confirm_allergies?: boolean | null
          confirm_attention?: boolean | null
          confirm_food?: boolean | null
          confirm_safe?: boolean
          confirm_vet?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          occupation?: string | null
          pet_id: string
          phone?: string | null
          reason?: string | null
          shelter_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          confirm_allergies?: boolean | null
          confirm_attention?: boolean | null
          confirm_food?: boolean | null
          confirm_safe?: boolean
          confirm_vet?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          occupation?: string | null
          pet_id?: string
          phone?: string | null
          reason?: string | null
          shelter_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adopt_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adopt_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_requests_shelter_id_fkey"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "shelter"
            referencedColumns: ["id"]
          },
        ]
      }
      donation: {
        Row: {
          account_name: string | null
          account_number: string | null
          created_at: string | null
          id: string
          instruction_note: string | null
          is_active: boolean | null
          item_name: string[] | null
          method: string | null
          qr_url: string | null
          shelter_id: string | null
          type: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string | null
          id?: string
          instruction_note?: string | null
          is_active?: boolean | null
          item_name?: string[] | null
          method?: string | null
          qr_url?: string | null
          shelter_id?: string | null
          type?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string | null
          id?: string
          instruction_note?: string | null
          is_active?: boolean | null
          item_name?: string[] | null
          method?: string | null
          qr_url?: string | null
          shelter_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_shelter_id_fkey"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "shelter"
            referencedColumns: ["id"]
          },
        ]
      }
      foster: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          pet_id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          pet_id?: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          pet_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foster_petID_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          adoption_request_id: string | null
          created_at: string
          created_by_user: boolean
          id: string
          last_message_at: string
          last_message_preview: string | null
          shelter_id: string
          subject: string
          thread_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adoption_request_id?: string | null
          created_at?: string
          created_by_user?: boolean
          id?: string
          last_message_at?: string
          last_message_preview?: string | null
          shelter_id: string
          subject: string
          thread_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adoption_request_id?: string | null
          created_at?: string
          created_by_user?: boolean
          id?: string
          last_message_at?: string
          last_message_preview?: string | null
          shelter_id?: string
          subject?: string
          thread_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_adoption_request_id_fkey"
            columns: ["adoption_request_id"]
            isOneToOne: false
            referencedRelation: "adoption_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_shelter_id_fkey"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "shelter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_by_shelter: boolean
          read_by_user: boolean
          sender_shelter_id: string | null
          sender_user_id: string | null
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_by_shelter?: boolean
          read_by_user?: boolean
          sender_shelter_id?: string | null
          sender_user_id?: string | null
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_by_shelter?: boolean
          read_by_user?: boolean
          sender_shelter_id?: string | null
          sender_user_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_shelter_id_fkey"
            columns: ["sender_shelter_id"]
            isOneToOne: false
            referencedRelation: "shelter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          pet_id: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_id?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_id?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_media_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: string | null
          breed: string | null
          created_at: string
          description: string | null
          id: string
          name: string | null
          photo_url: string | null
          sex: string
          shelter_id: string | null
          size: string | null
          spayed_neutered: boolean | null
          species: string | null
          status: string | null
          vaccinated: boolean | null
          year_inShelter: number | null
        }
        Insert: {
          age?: string | null
          breed?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          photo_url?: string | null
          sex: string
          shelter_id?: string | null
          size?: string | null
          spayed_neutered?: boolean | null
          species?: string | null
          status?: string | null
          vaccinated?: boolean | null
          year_inShelter?: number | null
        }
        Update: {
          age?: string | null
          breed?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          photo_url?: string | null
          sex?: string
          shelter_id?: string | null
          size?: string | null
          spayed_neutered?: boolean | null
          species?: string | null
          status?: string | null
          vaccinated?: boolean | null
          year_inShelter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_shelter_id_fkey1"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "shelter"
            referencedColumns: ["id"]
          },
        ]
      }
      shelter: {
        Row: {
          about: string | null
          application_review_note: string | null
          application_reviewed_at: string | null
          application_status: string | null
          application_submitted_at: string | null
          cert_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          id_url: string | null
          lease_url: string | null
          location: string
          logo_url: string | null
          owner_id: string | null
          photo_url: string | null
          reviewed_by: string | null
          shelter_name: string
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          application_review_note?: string | null
          application_reviewed_at?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          cert_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          id_url?: string | null
          lease_url?: string | null
          location: string
          logo_url?: string | null
          owner_id?: string | null
          photo_url?: string | null
          reviewed_by?: string | null
          shelter_name: string
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          application_review_note?: string | null
          application_reviewed_at?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          cert_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          id_url?: string | null
          lease_url?: string | null
          location?: string
          logo_url?: string | null
          owner_id?: string | null
          photo_url?: string | null
          reviewed_by?: string | null
          shelter_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shelter_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          full_name: string
          id: string
          photo_url: string | null
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          full_name: string
          id?: string
          photo_url?: string | null
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          full_name?: string
          id?: string
          photo_url?: string | null
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      video_views: {
        Row: {
          id: string
          media_id: string
          session_id: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          media_id: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          media_id?: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_views_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "pet_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_shelter_application: {
        Args: {
          p_review_note?: string
          p_reviewed_by?: string
          p_shelter_id: string
        }
        Returns: {
          application_review_note: string
          application_reviewed_at: string
          application_status: string
          application_submitted_at: string
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          location: string
          logo_url: string
          owner_id: string
          shelter_name: string
          updated_at: string
        }[]
      }
      get_feed: {
        Args: { pinned_media_id?: string }
        Returns: {
          caption: string
          created_at: string
          media_id: string
          name: string
          pet_id: string
          shelter: Json
          url: string
        }[]
      }
      get_random_feed: {
        Args: { limit_count: number }
        Returns: {
          caption: string
          created_at: string
          id: string
          name: string
          pet_media: Json
          shelter: Json
          type: string
        }[]
      }
      get_video_feed: {
        Args: { pinned_media_id?: string }
        Returns: {
          caption: string
          media_id: string
          media_url: string
          pet_id: string
          pet_name: string
          pet_photo_url: string
          shelter: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
