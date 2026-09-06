export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      crop_prices: {
        Row: {
          created_at: string
          created_by: string | null
          crop_id: string
          currency: string
          id: string
          is_official: boolean
          market_id: string | null
          notes: string | null
          price_date: string
          price_sdg: number
          price_usd: number | null
          source: string
          unit: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          crop_id: string
          currency?: string
          id?: string
          is_official?: boolean
          market_id?: string | null
          notes?: string | null
          price_date?: string
          price_sdg: number
          price_usd?: number | null
          source?: string
          unit?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          crop_id?: string
          currency?: string
          id?: string
          is_official?: boolean
          market_id?: string | null
          notes?: string | null
          price_date?: string
          price_sdg?: number
          price_usd?: number | null
          source?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_prices_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_prices_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          category: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          sort_order: number
          standard_unit: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          sort_order?: number
          standard_unit?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          sort_order?: number
          standard_unit?: string
        }
        Relationships: []
      }
      farm_crops: {
        Row: {
          actual_yield_tons: number | null
          allocated_area_unit: string | null
          allocated_area_value: number | null
          created_at: string
          crop_id: string
          expected_yield_tons: number | null
          farm_id: string
          harvest_date: string | null
          id: string
          planting_date: string | null
          season: string
          season_year: number
          status: string
          updated_at: string
        }
        Insert: {
          actual_yield_tons?: number | null
          allocated_area_unit?: string | null
          allocated_area_value?: number | null
          created_at?: string
          crop_id: string
          expected_yield_tons?: number | null
          farm_id: string
          harvest_date?: string | null
          id?: string
          planting_date?: string | null
          season: string
          season_year: number
          status?: string
          updated_at?: string
        }
        Update: {
          actual_yield_tons?: number | null
          allocated_area_unit?: string | null
          allocated_area_value?: number | null
          created_at?: string
          crop_id?: string
          expected_yield_tons?: number | null
          farm_id?: string
          harvest_date?: string | null
          id?: string
          planting_date?: string | null
          season?: string
          season_year?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_crops_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          area_hectares: number | null
          area_unit: string
          area_value: number
          created_at: string
          farmer_id: string
          id: string
          irrigation_type: string
          is_verified: boolean
          latitude: number | null
          locality: string | null
          longitude: number | null
          name: string
          name_ar: string | null
          soil_type: string | null
          state_id: string
          updated_at: string
        }
        Insert: {
          area_hectares?: number | null
          area_unit?: string
          area_value: number
          created_at?: string
          farmer_id: string
          id?: string
          irrigation_type?: string
          is_verified?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          name: string
          name_ar?: string | null
          soil_type?: string | null
          state_id: string
          updated_at?: string
        }
        Update: {
          area_hectares?: number | null
          area_unit?: string
          area_value?: number
          created_at?: string
          farmer_id?: string
          id?: string
          irrigation_type?: string
          is_verified?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          name?: string
          name_ar?: string | null
          soil_type?: string | null
          state_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farms_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farms_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          buyer_id: string
          contact_phone: string | null
          created_at: string
          id: string
          listing_id: string
          message: string
          offered_price: number | null
          requested_quantity: number | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          listing_id: string
          message: string
          offered_price?: number | null
          requested_quantity?: number | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          message?: string
          offered_price?: number | null
          requested_quantity?: number | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_media: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          listing_id: string
          media_type: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id: string
          media_type?: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id?: string
          media_type?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: string
          created_at: string
          crop_id: string | null
          currency: string
          description_ar: string | null
          description_en: string | null
          expires_at: string
          featured: boolean
          id: string
          inquiries_count: number
          location_name_ar: string | null
          location_name_en: string | null
          market_id: string | null
          price: number
          quantity: number
          state_id: string
          status: string
          title_ar: string
          title_en: string
          unit: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          category: string
          created_at?: string
          crop_id?: string | null
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          expires_at?: string
          featured?: boolean
          id?: string
          inquiries_count?: number
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          price: number
          quantity: number
          state_id: string
          status?: string
          title_ar: string
          title_en: string
          unit: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          crop_id?: string | null
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          expires_at?: string
          featured?: boolean
          id?: string
          inquiries_count?: number
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          price?: number
          quantity?: number
          state_id?: string
          status?: string
          title_ar?: string
          title_en?: string
          unit?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          city_ar: string
          city_en: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          market_type: string
          name_ar: string
          name_en: string
          state_id: string
        }
        Insert: {
          city_ar: string
          city_en: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          market_type?: string
          name_ar: string
          name_en: string
          state_id: string
        }
        Update: {
          city_ar?: string
          city_en?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          market_type?: string
          name_ar?: string
          name_en?: string
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "markets_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_events: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          moderator_id: string | null
          reason: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          moderator_id?: string | null
          reason: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          moderator_id?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_events_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_events_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          full_name_ar: string | null
          id: string
          is_verified: boolean
          metadata: Json
          phone: string | null
          preferred_language: string
          role: string
          state_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          full_name_ar?: string | null
          id: string
          is_verified?: boolean
          metadata?: Json
          phone?: string | null
          preferred_language?: string
          role?: string
          state_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          full_name_ar?: string | null
          id?: string
          is_verified?: boolean
          metadata?: Json
          phone?: string | null
          preferred_language?: string
          role?: string
          state_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_state"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          capital_ar: string
          capital_en: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          region: string
        }
        Insert: {
          capital_ar: string
          capital_en: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          region: string
        }
        Update: {
          capital_ar?: string
          capital_en?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          region?: string
        }
        Relationships: []
      }
      trader_profiles: {
        Row: {
          business_name: string
          business_name_ar: string | null
          commodities_of_interest: Json
          created_at: string
          id: string
          is_verified_trader: boolean
          operating_markets: Json
          rating: number
          registration_number: string | null
          tax_id: string | null
          total_deals_completed: number
          trader_type: string
          updated_at: string
        }
        Insert: {
          business_name: string
          business_name_ar?: string | null
          commodities_of_interest?: Json
          created_at?: string
          id: string
          is_verified_trader?: boolean
          operating_markets?: Json
          rating?: number
          registration_number?: string | null
          tax_id?: string | null
          total_deals_completed?: number
          trader_type?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          business_name_ar?: string | null
          commodities_of_interest?: Json
          created_at?: string
          id?: string
          is_verified_trader?: boolean
          operating_markets?: Json
          rating?: number
          registration_number?: string | null
          tax_id?: string | null
          total_deals_completed?: number
          trader_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trader_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trader_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language?: string
          name: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      marketplace_seller_public: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          full_name_ar: string | null
          id: string | null
          is_verified: boolean | null
          rating: number | null
          role: string | null
          total_deals_completed: number | null
        }
        Relationships: []
      }
      public_traders: {
        Row: {
          business_name: string | null
          commodities_of_interest: Json | null
          id: string | null
          is_verified_trader: boolean | null
          operating_markets: Json | null
          rating: number | null
          trader_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trader_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trader_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_role: { Args: never; Returns: string }
      is_active_user: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

