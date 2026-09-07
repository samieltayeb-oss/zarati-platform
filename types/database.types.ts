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
      canonical_commodities: {
        Row: {
          botanical_name: string | null
          code: string
          created_at: string
          crop_id: string
          grade_ar: string
          grade_en: string
          hs_code: string | null
          id: string
          is_active: boolean
          standard_unit: string
          variety_ar: string
          variety_en: string
        }
        Insert: {
          botanical_name?: string | null
          code: string
          created_at?: string
          crop_id: string
          grade_ar?: string
          grade_en?: string
          hs_code?: string | null
          id?: string
          is_active?: boolean
          standard_unit?: string
          variety_ar: string
          variety_en: string
        }
        Update: {
          botanical_name?: string | null
          code?: string
          created_at?: string
          crop_id?: string
          grade_ar?: string
          grade_en?: string
          hs_code?: string | null
          id?: string
          is_active?: boolean
          standard_unit?: string
          variety_ar?: string
          variety_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_commodities_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_commodities_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
          },
        ]
      }
      canonical_commodity_aliases: {
        Row: {
          commodity_id: string
          created_at: string
          default_price_type: Database["public"]["Enums"]["price_type_enum"]
          id: string
          source_id: string
          source_raw_string: string
        }
        Insert: {
          commodity_id: string
          created_at?: string
          default_price_type?: Database["public"]["Enums"]["price_type_enum"]
          id?: string
          source_id: string
          source_raw_string: string
        }
        Update: {
          commodity_id?: string
          created_at?: string
          default_price_type?: Database["public"]["Enums"]["price_type_enum"]
          id?: string
          source_id?: string
          source_raw_string?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_commodity_aliases_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "canonical_commodities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_commodity_aliases_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "canonical_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_currencies: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          name_ar: string
          name_en: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          name_ar: string
          name_en: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      canonical_datasets: {
        Row: {
          created_at: string
          dataset_identifier: string
          description: string | null
          download_url: string | null
          format: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          schema_definition: Json | null
          source_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dataset_identifier: string
          description?: string | null
          download_url?: string | null
          format: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          schema_definition?: Json | null
          source_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dataset_identifier?: string
          description?: string | null
          download_url?: string | null
          format?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          schema_definition?: Json | null
          source_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_datasets_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "canonical_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_localities: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          pcode: string | null
          state_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          pcode?: string | null
          state_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          pcode?: string | null
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_localities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_market_aliases: {
        Row: {
          created_at: string
          id: string
          market_id: string
          source_id: string
          source_raw_market_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          source_id: string
          source_raw_market_name: string
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          source_id?: string
          source_raw_market_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_market_aliases_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_market_aliases_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "canonical_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_schemes: {
        Row: {
          area_feddans: number | null
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          primary_state_id: string
          scheme_type: string
        }
        Insert: {
          area_feddans?: number | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          primary_state_id: string
          scheme_type: string
        }
        Update: {
          area_feddans?: number | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          primary_state_id?: string
          scheme_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "canonical_schemes_primary_state_id_fkey"
            columns: ["primary_state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_sources: {
        Row: {
          access_method: string
          attribution_text_ar: string
          attribution_text_en: string
          authority: string
          code: string
          country: string
          created_at: string
          expected_latency_days: number
          id: string
          is_active: boolean
          license_type: string
          license_url: string | null
          name_ar: string
          name_en: string
          notes: string | null
          publisher: string
          source_url: string
          tier: Database["public"]["Enums"]["source_tier_enum"]
          update_frequency: string
          updated_at: string
        }
        Insert: {
          access_method: string
          attribution_text_ar: string
          attribution_text_en: string
          authority: string
          code: string
          country?: string
          created_at?: string
          expected_latency_days?: number
          id?: string
          is_active?: boolean
          license_type: string
          license_url?: string | null
          name_ar: string
          name_en: string
          notes?: string | null
          publisher: string
          source_url: string
          tier: Database["public"]["Enums"]["source_tier_enum"]
          update_frequency: string
          updated_at?: string
        }
        Update: {
          access_method?: string
          attribution_text_ar?: string
          attribution_text_en?: string
          authority?: string
          code?: string
          country?: string
          created_at?: string
          expected_latency_days?: number
          id?: string
          is_active?: boolean
          license_type?: string
          license_url?: string | null
          name_ar?: string
          name_en?: string
          notes?: string | null
          publisher?: string
          source_url?: string
          tier?: Database["public"]["Enums"]["source_tier_enum"]
          update_frequency?: string
          updated_at?: string
        }
        Relationships: []
      }
      canonical_units: {
        Row: {
          code: string
          confidence_level: string
          conversion_authority: string | null
          created_at: string
          crop_id: string | null
          is_verified_standard: boolean
          market_id: string | null
          max_weight_kg: number | null
          min_weight_kg: number | null
          name_ar: string
          name_en: string
          state_id: string | null
          weight_kg_nominal: number | null
        }
        Insert: {
          code: string
          confidence_level: string
          conversion_authority?: string | null
          created_at?: string
          crop_id?: string | null
          is_verified_standard?: boolean
          market_id?: string | null
          max_weight_kg?: number | null
          min_weight_kg?: number | null
          name_ar: string
          name_en: string
          state_id?: string | null
          weight_kg_nominal?: number | null
        }
        Update: {
          code?: string
          confidence_level?: string
          conversion_authority?: string | null
          created_at?: string
          crop_id?: string | null
          is_verified_standard?: boolean
          market_id?: string | null
          max_weight_kg?: number | null
          min_weight_kg?: number | null
          name_ar?: string
          name_en?: string
          state_id?: string | null
          weight_kg_nominal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "canonical_units_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_units_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
          },
          {
            foreignKeyName: "canonical_units_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_units_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
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
            foreignKeyName: "crop_prices_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
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
            foreignKeyName: "farm_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
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
            foreignKeyName: "inquiries_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_listings_view"
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
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_listings_view"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          available_from: string | null
          available_until: string | null
          category: string
          created_at: string
          crop_id: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          expires_at: string
          farm_id: string | null
          featured: boolean
          id: string
          inquiries_count: number
          location_name_ar: string | null
          location_name_en: string | null
          market_id: string | null
          moderation_status: string
          price: number | null
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
          available_from?: string | null
          available_until?: string | null
          category: string
          created_at?: string
          crop_id?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          expires_at?: string
          farm_id?: string | null
          featured?: boolean
          id?: string
          inquiries_count?: number
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          moderation_status?: string
          price?: number | null
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
          available_from?: string | null
          available_until?: string | null
          category?: string
          created_at?: string
          crop_id?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          expires_at?: string
          farm_id?: string | null
          featured?: boolean
          id?: string
          inquiries_count?: number
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          moderation_status?: string
          price?: number | null
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
            foreignKeyName: "listings_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
          },
          {
            foreignKeyName: "listings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
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
      market_price_observations: {
        Row: {
          canonical_currency_code: string | null
          commodity_id: string
          conversion_factor_used: number | null
          conversion_rule_applied: string | null
          dataset_id: string | null
          derivation_class: Database["public"]["Enums"]["derivation_class_enum"]
          id: string
          ingested_at: string
          ingestion_method: Database["public"]["Enums"]["ingestion_method_enum"]
          market_id: string
          normalized_price_per_kg: number | null
          normalized_price_per_mt: number | null
          normalized_price_usd_per_mt: number | null
          observed_at: string
          parsed_price_numeric: number | null
          price_type: Database["public"]["Enums"]["price_type_enum"]
          publication_status: Database["public"]["Enums"]["publication_status_enum"]
          published_at: string | null
          raw_currency_text: string
          raw_price_text: string
          raw_snapshot_id: string | null
          raw_unit_text: string
          reported_at: string | null
          retraction_rationale: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_id: string
          source_provenance: Database["public"]["Enums"]["source_provenance_enum"]
          source_record_id: string | null
          source_record_key: string
          source_record_raw: string | null
          stale_after_at: string
          temporal_class: Database["public"]["Enums"]["temporal_class_enum"]
          temporal_precision: Database["public"]["Enums"]["temporal_precision_enum"]
          trust_score: string | null
          valid_from: string | null
          valid_to: string | null
          verification_state: Database["public"]["Enums"]["verification_state_enum"]
          verified_at: string | null
        }
        Insert: {
          canonical_currency_code?: string | null
          commodity_id: string
          conversion_factor_used?: number | null
          conversion_rule_applied?: string | null
          dataset_id?: string | null
          derivation_class: Database["public"]["Enums"]["derivation_class_enum"]
          id?: string
          ingested_at?: string
          ingestion_method: Database["public"]["Enums"]["ingestion_method_enum"]
          market_id: string
          normalized_price_per_kg?: number | null
          normalized_price_per_mt?: number | null
          normalized_price_usd_per_mt?: number | null
          observed_at: string
          parsed_price_numeric?: number | null
          price_type?: Database["public"]["Enums"]["price_type_enum"]
          publication_status?: Database["public"]["Enums"]["publication_status_enum"]
          published_at?: string | null
          raw_currency_text: string
          raw_price_text: string
          raw_snapshot_id?: string | null
          raw_unit_text: string
          reported_at?: string | null
          retraction_rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id: string
          source_provenance: Database["public"]["Enums"]["source_provenance_enum"]
          source_record_id?: string | null
          source_record_key: string
          source_record_raw?: string | null
          stale_after_at: string
          temporal_class: Database["public"]["Enums"]["temporal_class_enum"]
          temporal_precision?: Database["public"]["Enums"]["temporal_precision_enum"]
          trust_score?: string | null
          valid_from?: string | null
          valid_to?: string | null
          verification_state?: Database["public"]["Enums"]["verification_state_enum"]
          verified_at?: string | null
        }
        Update: {
          canonical_currency_code?: string | null
          commodity_id?: string
          conversion_factor_used?: number | null
          conversion_rule_applied?: string | null
          dataset_id?: string | null
          derivation_class?: Database["public"]["Enums"]["derivation_class_enum"]
          id?: string
          ingested_at?: string
          ingestion_method?: Database["public"]["Enums"]["ingestion_method_enum"]
          market_id?: string
          normalized_price_per_kg?: number | null
          normalized_price_per_mt?: number | null
          normalized_price_usd_per_mt?: number | null
          observed_at?: string
          parsed_price_numeric?: number | null
          price_type?: Database["public"]["Enums"]["price_type_enum"]
          publication_status?: Database["public"]["Enums"]["publication_status_enum"]
          published_at?: string | null
          raw_currency_text?: string
          raw_price_text?: string
          raw_snapshot_id?: string | null
          raw_unit_text?: string
          reported_at?: string | null
          retraction_rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id?: string
          source_provenance?: Database["public"]["Enums"]["source_provenance_enum"]
          source_record_id?: string | null
          source_record_key?: string
          source_record_raw?: string | null
          stale_after_at?: string
          temporal_class?: Database["public"]["Enums"]["temporal_class_enum"]
          temporal_precision?: Database["public"]["Enums"]["temporal_precision_enum"]
          trust_score?: string | null
          valid_from?: string | null
          valid_to?: string | null
          verification_state?: Database["public"]["Enums"]["verification_state_enum"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_mpo_dataset_source"
            columns: ["dataset_id", "source_id"]
            isOneToOne: false
            referencedRelation: "canonical_datasets"
            referencedColumns: ["id", "source_id"]
          },
          {
            foreignKeyName: "market_price_observations_canonical_currency_code_fkey"
            columns: ["canonical_currency_code"]
            isOneToOne: false
            referencedRelation: "canonical_currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "market_price_observations_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "canonical_commodities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "canonical_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_raw_snapshot_id_fkey"
            columns: ["raw_snapshot_id"]
            isOneToOne: false
            referencedRelation: "raw_ingestion_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_price_observations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "canonical_sources"
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
      observation_conflict_ledger: {
        Row: {
          conflicting_observation_id: string
          created_at: string
          id: string
          price_divergence_pct: number
          primary_observation_id: string
          resolution_rationale: string | null
          resolution_status: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          conflicting_observation_id: string
          created_at?: string
          id?: string
          price_divergence_pct: number
          primary_observation_id: string
          resolution_rationale?: string | null
          resolution_status?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          conflicting_observation_id?: string
          created_at?: string
          id?: string
          price_divergence_pct?: number
          primary_observation_id?: string
          resolution_rationale?: string | null
          resolution_status?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observation_conflict_ledger_conflicting_observation_id_fkey"
            columns: ["conflicting_observation_id"]
            isOneToOne: false
            referencedRelation: "market_price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_conflicting_observation_id_fkey"
            columns: ["conflicting_observation_id"]
            isOneToOne: false
            referencedRelation: "v_approved_market_prices"
            referencedColumns: ["observation_id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_conflicting_observation_id_fkey"
            columns: ["conflicting_observation_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_primary_observation_id_fkey"
            columns: ["primary_observation_id"]
            isOneToOne: false
            referencedRelation: "market_price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_primary_observation_id_fkey"
            columns: ["primary_observation_id"]
            isOneToOne: false
            referencedRelation: "v_approved_market_prices"
            referencedColumns: ["observation_id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_primary_observation_id_fkey"
            columns: ["primary_observation_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_conflict_ledger_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_quality_flags: {
        Row: {
          created_at: string
          details: Json | null
          flag_code: string
          id: string
          observation_id: string
          severity: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          flag_code: string
          id?: string
          observation_id: string
          severity: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          flag_code?: string
          id?: string
          observation_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "observation_quality_flags_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "market_price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_quality_flags_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_approved_market_prices"
            referencedColumns: ["observation_id"]
          },
          {
            foreignKeyName: "observation_quality_flags_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_transformations: {
        Row: {
          id: string
          input_value: string
          notes: string | null
          observation_id: string
          output_value: string
          parameters: Json | null
          performed_at: string
          performed_by: string
          rule_code: string
          rule_version: string
          transformation_type: string
        }
        Insert: {
          id?: string
          input_value: string
          notes?: string | null
          observation_id: string
          output_value: string
          parameters?: Json | null
          performed_at?: string
          performed_by: string
          rule_code: string
          rule_version: string
          transformation_type: string
        }
        Update: {
          id?: string
          input_value?: string
          notes?: string | null
          observation_id?: string
          output_value?: string
          parameters?: Json | null
          performed_at?: string
          performed_by?: string
          rule_code?: string
          rule_version?: string
          transformation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "observation_transformations_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "market_price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_transformations_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_approved_market_prices"
            referencedColumns: ["observation_id"]
          },
          {
            foreignKeyName: "observation_transformations_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_verification_evidence: {
        Row: {
          dimension: Database["public"]["Enums"]["verification_dimension_enum"]
          evaluated_at: string
          evaluated_by: string | null
          evidence_reference: string
          id: string
          notes: string | null
          observation_id: string
          status: string
        }
        Insert: {
          dimension: Database["public"]["Enums"]["verification_dimension_enum"]
          evaluated_at?: string
          evaluated_by?: string | null
          evidence_reference: string
          id?: string
          notes?: string | null
          observation_id: string
          status: string
        }
        Update: {
          dimension?: Database["public"]["Enums"]["verification_dimension_enum"]
          evaluated_at?: string
          evaluated_by?: string | null
          evidence_reference?: string
          id?: string
          notes?: string | null
          observation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "observation_verification_evidence_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_verification_evidence_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_verification_evidence_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "market_price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_verification_evidence_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_approved_market_prices"
            referencedColumns: ["observation_id"]
          },
          {
            foreignKeyName: "observation_verification_evidence_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
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
      raw_ingestion_snapshots: {
        Row: {
          dataset_id: string
          id: string
          ingested_at: string
          ingested_by: string | null
          notes: string | null
          payload_sha256: string
          record_count: number
          storage_uri: string
        }
        Insert: {
          dataset_id: string
          id?: string
          ingested_at?: string
          ingested_by?: string | null
          notes?: string | null
          payload_sha256: string
          record_count: number
          storage_uri: string
        }
        Update: {
          dataset_id?: string
          id?: string
          ingested_at?: string
          ingested_by?: string | null
          notes?: string | null
          payload_sha256?: string
          record_count?: number
          storage_uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_ingestion_snapshots_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "canonical_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_ingestion_snapshots_ingested_by_fkey"
            columns: ["ingested_by"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_ingestion_snapshots_ingested_by_fkey"
            columns: ["ingested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      public_listings_view: {
        Row: {
          available_from: string | null
          available_until: string | null
          category: string | null
          created_at: string | null
          crop_id: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          id: string | null
          location_name_ar: string | null
          location_name_en: string | null
          market_id: string | null
          price: number | null
          quantity: number | null
          state_id: string | null
          title_ar: string | null
          title_en: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          category?: string | null
          created_at?: string | null
          crop_id?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string | null
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          price?: number | null
          quantity?: number | null
          state_id?: string | null
          title_ar?: string | null
          title_en?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          category?: string | null
          created_at?: string | null
          crop_id?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string | null
          location_name_ar?: string | null
          location_name_en?: string | null
          market_id?: string | null
          price?: number | null
          quantity?: number | null
          state_id?: string | null
          title_ar?: string | null
          title_en?: string | null
          unit?: string | null
          updated_at?: string | null
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
            foreignKeyName: "listings_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "v_legacy_crop_prices_bridge"
            referencedColumns: ["crop_id"]
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
        ]
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
      v_approved_market_prices: {
        Row: {
          attribution_text_ar: string | null
          attribution_text_en: string | null
          crop_code: string | null
          crop_name_ar: string | null
          crop_name_en: string | null
          currency: string | null
          derivation_class:
            | Database["public"]["Enums"]["derivation_class_enum"]
            | null
          grade_ar: string | null
          grade_en: string | null
          is_stale: boolean | null
          market_code: string | null
          market_name_ar: string | null
          market_name_en: string | null
          normalized_price_per_kg: number | null
          normalized_price_per_mt: number | null
          observation_id: string | null
          observed_at: string | null
          parsed_price_numeric: number | null
          price_type: Database["public"]["Enums"]["price_type_enum"] | null
          published_at: string | null
          raw_price_text: string | null
          source_code: string | null
          source_name_en: string | null
          source_provenance:
            | Database["public"]["Enums"]["source_provenance_enum"]
            | null
          state_name_ar: string | null
          state_name_en: string | null
          temporal_precision:
            | Database["public"]["Enums"]["temporal_precision_enum"]
            | null
          trust_score: string | null
          unit: string | null
          valid_from: string | null
          valid_to: string | null
          variety_ar: string | null
          variety_en: string | null
          verification_state:
            | Database["public"]["Enums"]["verification_state_enum"]
            | null
        }
        Relationships: []
      }
      v_legacy_crop_prices_bridge: {
        Row: {
          created_at: string | null
          created_by: string | null
          crop_id: string | null
          currency: string | null
          id: string | null
          is_official: boolean | null
          market_id: string | null
          notes: string | null
          price_date: string | null
          price_sdg: number | null
          price_usd: number | null
          source: string | null
          unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_price_observations_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_role: { Args: never; Returns: string }
      get_rfq_contact_details: {
        Args: { p_inquiry_id: string }
        Returns: {
          email: string
          full_name: string
          phone: string
          role: string
        }[]
      }
      is_active_user: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      derivation_class_enum:
        | "observed_transaction"
        | "reported_survey"
        | "calculated_median"
        | "model_estimated"
      ingestion_method_enum:
        | "automated_api"
        | "automated_feed"
        | "manual_bulletin_entry"
        | "ocr_extract"
        | "batch_import"
      price_type_enum:
        | "farmgate"
        | "primary_auction"
        | "wholesale"
        | "retail"
        | "export_fob"
      publication_status_enum:
        | "INGESTED"
        | "QUARANTINED"
        | "UNDER_REVIEW"
        | "APPROVED"
        | "PUBLISHED"
        | "RETRACTED"
      source_provenance_enum:
        | "sovereign_statutory"
        | "institutional_multilateral"
        | "commercial_exchange"
        | "market_reported"
        | "field_survey"
      source_tier_enum:
        | "TIER_A_PRIMARY_EXCHANGE"
        | "TIER_B_INSTITUTIONAL"
        | "TIER_C_SOVEREIGN_STATUTORY"
        | "TIER_D_BENCHMARK_GLOBAL"
        | "TIER_E_SURVEY_FIELD"
      temporal_class_enum: "current_spot" | "historical_archive" | "backfill"
      temporal_precision_enum:
        | "EXACT_TIMESTAMP"
        | "CALENDAR_DAY"
        | "CALENDAR_MONTH"
        | "SEASONAL_RANGE"
      verification_dimension_enum:
        | "SOURCE_AUTHORITY"
        | "INGESTION_INTEGRITY"
        | "FIELD_CORROBORATION"
        | "STATISTICAL_PLAUSIBILITY"
      verification_state_enum:
        | "unassessed"
        | "partially_verified"
        | "verified"
        | "disputed"
        | "rejected"
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
    Enums: {
      derivation_class_enum: [
        "observed_transaction",
        "reported_survey",
        "calculated_median",
        "model_estimated",
      ],
      ingestion_method_enum: [
        "automated_api",
        "automated_feed",
        "manual_bulletin_entry",
        "ocr_extract",
        "batch_import",
      ],
      price_type_enum: [
        "farmgate",
        "primary_auction",
        "wholesale",
        "retail",
        "export_fob",
      ],
      publication_status_enum: [
        "INGESTED",
        "QUARANTINED",
        "UNDER_REVIEW",
        "APPROVED",
        "PUBLISHED",
        "RETRACTED",
      ],
      source_provenance_enum: [
        "sovereign_statutory",
        "institutional_multilateral",
        "commercial_exchange",
        "market_reported",
        "field_survey",
      ],
      source_tier_enum: [
        "TIER_A_PRIMARY_EXCHANGE",
        "TIER_B_INSTITUTIONAL",
        "TIER_C_SOVEREIGN_STATUTORY",
        "TIER_D_BENCHMARK_GLOBAL",
        "TIER_E_SURVEY_FIELD",
      ],
      temporal_class_enum: ["current_spot", "historical_archive", "backfill"],
      temporal_precision_enum: [
        "EXACT_TIMESTAMP",
        "CALENDAR_DAY",
        "CALENDAR_MONTH",
        "SEASONAL_RANGE",
      ],
      verification_dimension_enum: [
        "SOURCE_AUTHORITY",
        "INGESTION_INTEGRITY",
        "FIELD_CORROBORATION",
        "STATISTICAL_PLAUSIBILITY",
      ],
      verification_state_enum: [
        "unassessed",
        "partially_verified",
        "verified",
        "disputed",
        "rejected",
      ],
    },
  },
} as const

