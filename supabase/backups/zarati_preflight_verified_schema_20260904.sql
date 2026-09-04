


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."check_profile_privileges_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can change user roles.';
    END IF;
  END IF;
  IF NEW.is_verified <> OLD.is_verified THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify verification status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_profile_privileges_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_trader_privileges_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF NEW.is_verified_trader <> OLD.is_verified_trader OR NEW.rating <> OLD.rating OR NEW.total_deals_completed <> OLD.total_deals_completed THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify trader verification or reputation metrics.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_trader_privileges_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_role"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


ALTER FUNCTION "public"."current_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_current_timestamp_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."crop_prices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "crop_id" "uuid" NOT NULL,
    "market_id" "uuid",
    "price_sdg" numeric(12,2) NOT NULL,
    "price_usd" numeric(10,2),
    "currency" "text" DEFAULT 'SDG'::"text" NOT NULL,
    "unit" "text" DEFAULT 'ton'::"text" NOT NULL,
    "price_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "source" "text" DEFAULT 'market_authority'::"text" NOT NULL,
    "is_official" boolean DEFAULT true NOT NULL,
    "notes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "crop_prices_currency_check" CHECK (("currency" = ANY (ARRAY['SDG'::"text", 'USD'::"text"]))),
    CONSTRAINT "crop_prices_price_sdg_check" CHECK (("price_sdg" > (0)::numeric)),
    CONSTRAINT "crop_prices_price_usd_check" CHECK ((("price_usd" IS NULL) OR ("price_usd" > (0)::numeric))),
    CONSTRAINT "crop_prices_source_check" CHECK (("source" = ANY (ARRAY['market_authority'::"text", 'trader_survey'::"text", 'fao_amis'::"text", 'ebus_sudan'::"text", 'admin_override'::"text"]))),
    CONSTRAINT "crop_prices_unit_check" CHECK (("unit" = ANY (ARRAY['ton'::"text", 'kantar'::"text", 'bag_50kg'::"text", 'bag_100kg'::"text", 'kg'::"text"])))
);


ALTER TABLE "public"."crop_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."crops" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "category" "text" NOT NULL,
    "standard_unit" "text" DEFAULT 'ton'::"text" NOT NULL,
    "sort_order" smallint DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "crops_category_check" CHECK (("category" = ANY (ARRAY['grain'::"text", 'oilseed'::"text", 'cash'::"text", 'vegetable'::"text", 'fruit'::"text", 'fodder'::"text"]))),
    CONSTRAINT "crops_standard_unit_check" CHECK (("standard_unit" = ANY (ARRAY['ton'::"text", 'kantar'::"text", 'bag_50kg'::"text", 'bag_100kg'::"text", 'kg'::"text", 'bundle'::"text"])))
);


ALTER TABLE "public"."crops" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_crops" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farm_id" "uuid" NOT NULL,
    "crop_id" "uuid" NOT NULL,
    "season" "text" NOT NULL,
    "season_year" smallint NOT NULL,
    "allocated_area_value" numeric(10,2),
    "allocated_area_unit" "text" DEFAULT 'feddan'::"text",
    "planting_date" "date",
    "harvest_date" "date",
    "expected_yield_tons" numeric(10,2),
    "actual_yield_tons" numeric(10,2),
    "status" "text" DEFAULT 'planned'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_harvest_after_planting" CHECK ((("harvest_date" IS NULL) OR ("planting_date" IS NULL) OR ("harvest_date" >= "planting_date"))),
    CONSTRAINT "farm_crops_actual_yield_tons_check" CHECK (("actual_yield_tons" >= (0)::numeric)),
    CONSTRAINT "farm_crops_allocated_area_unit_check" CHECK (("allocated_area_unit" = ANY (ARRAY['feddan'::"text", 'hectare'::"text", 'acre'::"text"]))),
    CONSTRAINT "farm_crops_allocated_area_value_check" CHECK (("allocated_area_value" > (0)::numeric)),
    CONSTRAINT "farm_crops_expected_yield_tons_check" CHECK (("expected_yield_tons" >= (0)::numeric)),
    CONSTRAINT "farm_crops_season_check" CHECK (("season" = ANY (ARRAY['summer'::"text", 'winter'::"text", 'autumn'::"text", 'perennial'::"text"]))),
    CONSTRAINT "farm_crops_season_year_check" CHECK ((("season_year" >= 2020) AND ("season_year" <= 2100))),
    CONSTRAINT "farm_crops_status_check" CHECK (("status" = ANY (ARRAY['planned'::"text", 'planted'::"text", 'growing'::"text", 'harvesting'::"text", 'harvested'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."farm_crops" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farmer_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "name_ar" "text",
    "state_id" "uuid" NOT NULL,
    "locality" "text",
    "area_value" numeric(10,2) NOT NULL,
    "area_unit" "text" DEFAULT 'feddan'::"text" NOT NULL,
    "area_hectares" numeric(10,2) GENERATED ALWAYS AS ("round"(
CASE
    WHEN ("area_unit" = 'feddan'::"text") THEN ("area_value" * 0.4200)
    WHEN ("area_unit" = 'hectare'::"text") THEN "area_value"
    WHEN ("area_unit" = 'acre'::"text") THEN ("area_value" * 0.4047)
    ELSE NULL::numeric
END, 2)) STORED,
    "irrigation_type" "text" DEFAULT 'rainfed'::"text" NOT NULL,
    "soil_type" "text",
    "latitude" numeric(9,6),
    "longitude" numeric(9,6),
    "is_verified" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "farms_area_unit_check" CHECK (("area_unit" = ANY (ARRAY['feddan'::"text", 'hectare'::"text", 'acre'::"text"]))),
    CONSTRAINT "farms_area_value_check" CHECK (("area_value" > (0)::numeric)),
    CONSTRAINT "farms_irrigation_type_check" CHECK (("irrigation_type" = ANY (ARRAY['rainfed'::"text", 'irrigated_nile'::"text", 'irrigated_groundwater'::"text", 'flood_spate'::"text"]))),
    CONSTRAINT "farms_latitude_check" CHECK ((("latitude" IS NULL) OR (("latitude" >= 8.000000) AND ("latitude" <= 23.000000)))),
    CONSTRAINT "farms_longitude_check" CHECK ((("longitude" IS NULL) OR (("longitude" >= 21.000000) AND ("longitude" <= 39.000000)))),
    CONSTRAINT "farms_soil_type_check" CHECK (("soil_type" = ANY (ARRAY['clay'::"text", 'sandy_goz'::"text", 'alluvial'::"text", 'loam'::"text"])))
);


ALTER TABLE "public"."farms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inquiries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "listing_id" "uuid" NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "offered_price" numeric(14,2),
    "requested_quantity" numeric(12,2),
    "message" "text" NOT NULL,
    "contact_phone" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_buyer_not_seller" CHECK (("buyer_id" <> "seller_id")),
    CONSTRAINT "inquiries_offered_price_check" CHECK ((("offered_price" IS NULL) OR ("offered_price" > (0)::numeric))),
    CONSTRAINT "inquiries_requested_quantity_check" CHECK ((("requested_quantity" IS NULL) OR ("requested_quantity" > (0)::numeric))),
    CONSTRAINT "inquiries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."inquiries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."listing_media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "listing_id" "uuid" NOT NULL,
    "storage_path" "text" NOT NULL,
    "media_type" "text" DEFAULT 'image/jpeg'::"text" NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "sort_order" smallint DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "listing_media_media_type_check" CHECK (("media_type" = ANY (ARRAY['image/jpeg'::"text", 'image/png'::"text", 'image/webp'::"text"])))
);


ALTER TABLE "public"."listing_media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "category" "text" NOT NULL,
    "crop_id" "uuid",
    "title_en" "text" NOT NULL,
    "title_ar" "text" NOT NULL,
    "description_en" "text",
    "description_ar" "text",
    "price" numeric(14,2) NOT NULL,
    "currency" "text" DEFAULT 'SDG'::"text" NOT NULL,
    "unit" "text" NOT NULL,
    "quantity" numeric(12,2) NOT NULL,
    "state_id" "uuid" NOT NULL,
    "market_id" "uuid",
    "location_name_en" "text",
    "location_name_ar" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "views_count" integer DEFAULT 0 NOT NULL,
    "inquiries_count" integer DEFAULT 0 NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "listings_category_check" CHECK (("category" = ANY (ARRAY['crops'::"text", 'equipment'::"text", 'seeds'::"text", 'fertilizer'::"text"]))),
    CONSTRAINT "listings_currency_check" CHECK (("currency" = ANY (ARRAY['SDG'::"text", 'USD'::"text"]))),
    CONSTRAINT "listings_inquiries_count_check" CHECK (("inquiries_count" >= 0)),
    CONSTRAINT "listings_price_check" CHECK (("price" >= (0)::numeric)),
    CONSTRAINT "listings_quantity_check" CHECK (("quantity" > (0)::numeric)),
    CONSTRAINT "listings_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending_review'::"text", 'active'::"text", 'paused'::"text", 'sold'::"text", 'expired'::"text", 'archived'::"text"]))),
    CONSTRAINT "listings_views_count_check" CHECK (("views_count" >= 0))
);


ALTER TABLE "public"."listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'farmer'::"text" NOT NULL,
    "full_name" "text" NOT NULL,
    "full_name_ar" "text",
    "phone" "text",
    "email" "text",
    "preferred_language" "text" DEFAULT 'ar'::"text" NOT NULL,
    "state_id" "uuid",
    "avatar_url" "text",
    "is_verified" boolean DEFAULT false NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_preferred_language_check" CHECK (("preferred_language" = ANY (ARRAY['ar'::"text", 'en'::"text"]))),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['farmer'::"text", 'trader'::"text", 'admin'::"text", 'government'::"text", 'ngo'::"text", 'investor'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trader_profiles" (
    "id" "uuid" NOT NULL,
    "business_name" "text" NOT NULL,
    "business_name_ar" "text",
    "registration_number" "text",
    "tax_id" "text",
    "trader_type" "text" DEFAULT 'wholesaler'::"text" NOT NULL,
    "operating_markets" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "commodities_of_interest" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "is_verified_trader" boolean DEFAULT false NOT NULL,
    "rating" numeric(3,2) DEFAULT 5.00 NOT NULL,
    "total_deals_completed" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "trader_profiles_rating_check" CHECK ((("rating" >= 1.00) AND ("rating" <= 5.00))),
    CONSTRAINT "trader_profiles_total_deals_completed_check" CHECK (("total_deals_completed" >= 0)),
    CONSTRAINT "trader_profiles_trader_type_check" CHECK (("trader_type" = ANY (ARRAY['wholesaler'::"text", 'exporter'::"text", 'processor'::"text", 'retailer'::"text", 'broker'::"text", 'input_supplier'::"text"])))
);


ALTER TABLE "public"."trader_profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."marketplace_seller_public" AS
 SELECT "p"."id",
    "p"."full_name",
    "p"."full_name_ar",
    "p"."role",
    "p"."avatar_url",
    "p"."is_verified",
    COALESCE("tp"."rating", 5.00) AS "rating",
    COALESCE("tp"."total_deals_completed", 0) AS "total_deals_completed"
   FROM ("public"."profiles" "p"
     LEFT JOIN "public"."trader_profiles" "tp" ON (("p"."id" = "tp"."id")));


ALTER VIEW "public"."marketplace_seller_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."markets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "state_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "city_en" "text" NOT NULL,
    "city_ar" "text" NOT NULL,
    "market_type" "text" DEFAULT 'physical'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "markets_market_type_check" CHECK (("market_type" = ANY (ARRAY['physical'::"text", 'auction'::"text", 'terminal'::"text", 'border_post'::"text"])))
);


ALTER TABLE "public"."markets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."moderation_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "moderator_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "moderation_events_action_check" CHECK (("action" = ANY (ARRAY['flagged'::"text", 'approved'::"text", 'rejected'::"text", 'hidden'::"text", 'banned'::"text"]))),
    CONSTRAINT "moderation_events_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['profile'::"text", 'listing'::"text", 'inquiry'::"text", 'farm'::"text"])))
);


ALTER TABLE "public"."moderation_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "region" "text" NOT NULL,
    "capital_en" "text" NOT NULL,
    "capital_ar" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "states_region_check" CHECK (("region" = ANY (ARRAY['eastern'::"text", 'central'::"text", 'northern'::"text", 'darfur'::"text", 'kordofan'::"text", 'khartoum'::"text"])))
);


ALTER TABLE "public"."states" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waitlist" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" NOT NULL,
    "language" "text" DEFAULT 'ar'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "waitlist_role_check" CHECK (("role" = ANY (ARRAY['farmer'::"text", 'trader'::"text", 'ngo'::"text", 'government'::"text", 'investor'::"text"])))
);


ALTER TABLE "public"."waitlist" OWNER TO "postgres";


ALTER TABLE ONLY "public"."crop_prices"
    ADD CONSTRAINT "crop_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crops"
    ADD CONSTRAINT "crops_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."crops"
    ADD CONSTRAINT "crops_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_crops"
    ADD CONSTRAINT "farm_crops_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farms"
    ADD CONSTRAINT "farms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inquiries"
    ADD CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."listing_media"
    ADD CONSTRAINT "listing_media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."markets"
    ADD CONSTRAINT "markets_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."markets"
    ADD CONSTRAINT "markets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moderation_events"
    ADD CONSTRAINT "moderation_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trader_profiles"
    ADD CONSTRAINT "trader_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crop_prices"
    ADD CONSTRAINT "uq_crop_market_date" UNIQUE ("crop_id", "market_id", "price_date", "unit");



ALTER TABLE ONLY "public"."farm_crops"
    ADD CONSTRAINT "uq_farm_crop_season" UNIQUE ("farm_id", "crop_id", "season", "season_year");



ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_crop_prices_lookup" ON "public"."crop_prices" USING "btree" ("crop_id", "price_date" DESC);



CREATE INDEX "idx_crop_prices_market" ON "public"."crop_prices" USING "btree" ("market_id", "price_date" DESC);



CREATE INDEX "idx_crops_category" ON "public"."crops" USING "btree" ("category");



CREATE INDEX "idx_crops_is_active" ON "public"."crops" USING "btree" ("is_active");



CREATE INDEX "idx_crops_sort_order" ON "public"."crops" USING "btree" ("sort_order");



CREATE INDEX "idx_farm_crops_crop" ON "public"."farm_crops" USING "btree" ("crop_id");



CREATE INDEX "idx_farm_crops_farm" ON "public"."farm_crops" USING "btree" ("farm_id");



CREATE INDEX "idx_farm_crops_status" ON "public"."farm_crops" USING "btree" ("status");



CREATE INDEX "idx_farms_farmer" ON "public"."farms" USING "btree" ("farmer_id");



CREATE INDEX "idx_farms_irrigation" ON "public"."farms" USING "btree" ("irrigation_type");



CREATE INDEX "idx_farms_state" ON "public"."farms" USING "btree" ("state_id");



CREATE INDEX "idx_inquiries_buyer" ON "public"."inquiries" USING "btree" ("buyer_id");



CREATE INDEX "idx_inquiries_listing" ON "public"."inquiries" USING "btree" ("listing_id");



CREATE INDEX "idx_inquiries_seller" ON "public"."inquiries" USING "btree" ("seller_id");



CREATE INDEX "idx_inquiries_status" ON "public"."inquiries" USING "btree" ("status");



CREATE INDEX "idx_listing_media_listing" ON "public"."listing_media" USING "btree" ("listing_id", "sort_order");



CREATE INDEX "idx_listings_browse" ON "public"."listings" USING "btree" ("category", "status", "created_at" DESC);



CREATE INDEX "idx_listings_category" ON "public"."listings" USING "btree" ("category");



CREATE INDEX "idx_listings_created_at" ON "public"."listings" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_listings_state" ON "public"."listings" USING "btree" ("state_id");



CREATE INDEX "idx_listings_status" ON "public"."listings" USING "btree" ("status");



CREATE INDEX "idx_listings_user" ON "public"."listings" USING "btree" ("user_id");



CREATE INDEX "idx_markets_is_active" ON "public"."markets" USING "btree" ("is_active");



CREATE INDEX "idx_markets_state" ON "public"."markets" USING "btree" ("state_id");



CREATE INDEX "idx_moderation_created" ON "public"."moderation_events" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_moderation_entity" ON "public"."moderation_events" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_phone" ON "public"."profiles" USING "btree" ("phone");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_profiles_state" ON "public"."profiles" USING "btree" ("state_id");



CREATE INDEX "idx_states_is_active" ON "public"."states" USING "btree" ("is_active");



CREATE INDEX "idx_states_region" ON "public"."states" USING "btree" ("region");



CREATE INDEX "idx_trader_type" ON "public"."trader_profiles" USING "btree" ("trader_type");



CREATE INDEX "idx_trader_verified" ON "public"."trader_profiles" USING "btree" ("is_verified_trader");



CREATE INDEX "idx_waitlist_created_at" ON "public"."waitlist" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_waitlist_email" ON "public"."waitlist" USING "btree" ("email");



CREATE OR REPLACE TRIGGER "trg_farm_crops_updated_at" BEFORE UPDATE ON "public"."farm_crops" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_farms_updated_at" BEFORE UPDATE ON "public"."farms" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_inquiries_updated_at" BEFORE UPDATE ON "public"."inquiries" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_listings_updated_at" BEFORE UPDATE ON "public"."listings" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_protect_profile_privileges" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."check_profile_privileges_update"();



CREATE OR REPLACE TRIGGER "trg_protect_trader_privileges" BEFORE UPDATE ON "public"."trader_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."check_trader_privileges_update"();



CREATE OR REPLACE TRIGGER "trg_trader_profiles_updated_at" BEFORE UPDATE ON "public"."trader_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



ALTER TABLE ONLY "public"."crop_prices"
    ADD CONSTRAINT "crop_prices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."crop_prices"
    ADD CONSTRAINT "crop_prices_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."crop_prices"
    ADD CONSTRAINT "crop_prices_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."farm_crops"
    ADD CONSTRAINT "farm_crops_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."farm_crops"
    ADD CONSTRAINT "farm_crops_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farms"
    ADD CONSTRAINT "farms_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farms"
    ADD CONSTRAINT "farms_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "fk_profiles_state" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."inquiries"
    ADD CONSTRAINT "inquiries_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inquiries"
    ADD CONSTRAINT "inquiries_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inquiries"
    ADD CONSTRAINT "inquiries_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listing_media"
    ADD CONSTRAINT "listing_media_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."markets"
    ADD CONSTRAINT "markets_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."moderation_events"
    ADD CONSTRAINT "moderation_events_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trader_profiles"
    ADD CONSTRAINT "trader_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."crop_prices" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "crop_prices_admin_mutation" ON "public"."crop_prices" USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"))) WITH CHECK (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "crop_prices_select_public" ON "public"."crop_prices" FOR SELECT USING ((("is_official" = true) OR "public"."is_admin"()));



ALTER TABLE "public"."crops" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "crops_admin_mutation" ON "public"."crops" USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"))) WITH CHECK (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "crops_select_public" ON "public"."crops" FOR SELECT USING ((("is_active" = true) OR "public"."is_admin"()));



ALTER TABLE "public"."farm_crops" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farm_crops_delete_owner" ON "public"."farm_crops" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "public"."farms"
  WHERE (("farms"."id" = "farm_crops"."farm_id") AND ("farms"."farmer_id" = "auth"."uid"())))) OR "public"."is_admin"()));



CREATE POLICY "farm_crops_insert_owner" ON "public"."farm_crops" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."farms"
  WHERE (("farms"."id" = "farm_crops"."farm_id") AND ("farms"."farmer_id" = "auth"."uid"())))));



CREATE POLICY "farm_crops_select_owner_or_admin" ON "public"."farm_crops" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."farms"
  WHERE (("farms"."id" = "farm_crops"."farm_id") AND ("farms"."farmer_id" = "auth"."uid"())))) OR "public"."is_admin"()));



CREATE POLICY "farm_crops_update_owner" ON "public"."farm_crops" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."farms"
  WHERE (("farms"."id" = "farm_crops"."farm_id") AND ("farms"."farmer_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."farms"
  WHERE (("farms"."id" = "farm_crops"."farm_id") AND ("farms"."farmer_id" = "auth"."uid"())))));



ALTER TABLE "public"."farms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farms_delete_owner_or_admin" ON "public"."farms" FOR DELETE USING ((("farmer_id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "farms_insert_owner" ON "public"."farms" FOR INSERT WITH CHECK (("farmer_id" = "auth"."uid"()));



CREATE POLICY "farms_select_owner_or_admin" ON "public"."farms" FOR SELECT USING ((("farmer_id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "farms_update_owner" ON "public"."farms" FOR UPDATE USING (("farmer_id" = "auth"."uid"())) WITH CHECK (("farmer_id" = "auth"."uid"()));



ALTER TABLE "public"."inquiries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "inquiries_delete_admin" ON "public"."inquiries" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "inquiries_insert_buyer" ON "public"."inquiries" FOR INSERT WITH CHECK (("buyer_id" = "auth"."uid"()));



CREATE POLICY "inquiries_select_participants" ON "public"."inquiries" FOR SELECT USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "inquiries_update_participants" ON "public"."inquiries" FOR UPDATE USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"()) OR "public"."is_admin"())) WITH CHECK ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"()) OR "public"."is_admin"()));



ALTER TABLE "public"."listing_media" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "listing_media_delete_owner" ON "public"."listing_media" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "public"."listings" "l"
  WHERE (("l"."id" = "listing_media"."listing_id") AND ("l"."user_id" = "auth"."uid"())))) OR "public"."is_admin"()));



CREATE POLICY "listing_media_insert_owner" ON "public"."listing_media" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."listings" "l"
  WHERE (("l"."id" = "listing_media"."listing_id") AND ("l"."user_id" = "auth"."uid"())))));



CREATE POLICY "listing_media_select_public" ON "public"."listing_media" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."listings" "l"
  WHERE (("l"."id" = "listing_media"."listing_id") AND (("l"."status" = 'active'::"text") OR ("l"."user_id" = "auth"."uid"()) OR "public"."is_admin"())))));



ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "listings_delete_owner" ON "public"."listings" FOR DELETE USING ((("user_id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "listings_insert_owner" ON "public"."listings" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "listings_select_public" ON "public"."listings" FOR SELECT USING ((("status" = 'active'::"text") OR ("user_id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "listings_update_owner" ON "public"."listings" FOR UPDATE USING ((("user_id" = "auth"."uid"()) OR "public"."is_admin"())) WITH CHECK ((("user_id" = "auth"."uid"()) OR "public"."is_admin"()));



ALTER TABLE "public"."markets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "markets_admin_mutation" ON "public"."markets" USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"))) WITH CHECK (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "markets_select_public" ON "public"."markets" FOR SELECT USING ((("is_active" = true) OR "public"."is_admin"()));



CREATE POLICY "moderation_admin_all" ON "public"."moderation_events" USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"))) WITH CHECK (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



ALTER TABLE "public"."moderation_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_delete_admin" ON "public"."profiles" FOR DELETE USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "profiles_insert_service_or_owner" ON "public"."profiles" FOR INSERT WITH CHECK ((("auth"."uid"() = "id") OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "profiles_select_admin" ON "public"."profiles" FOR SELECT USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "profiles_select_owner" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_update_owner" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."states" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "states_admin_mutation" ON "public"."states" USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"))) WITH CHECK (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "states_select_public" ON "public"."states" FOR SELECT USING ((("is_active" = true) OR "public"."is_admin"()));



ALTER TABLE "public"."trader_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trader_profiles_delete_admin" ON "public"."trader_profiles" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "trader_profiles_insert_owner" ON "public"."trader_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "trader_profiles_select_public" ON "public"."trader_profiles" FOR SELECT USING (true);



CREATE POLICY "trader_profiles_update_owner" ON "public"."trader_profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."waitlist" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "waitlist_admin_select" ON "public"."waitlist" FOR SELECT USING (("public"."is_admin"() OR (("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "waitlist_public_insert" ON "public"."waitlist" FOR INSERT WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";




























































































































































GRANT ALL ON FUNCTION "public"."check_profile_privileges_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_profile_privileges_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_profile_privileges_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_trader_privileges_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_trader_privileges_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_trader_privileges_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";


















GRANT ALL ON TABLE "public"."crop_prices" TO "anon";
GRANT ALL ON TABLE "public"."crop_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."crop_prices" TO "service_role";



GRANT ALL ON TABLE "public"."crops" TO "anon";
GRANT ALL ON TABLE "public"."crops" TO "authenticated";
GRANT ALL ON TABLE "public"."crops" TO "service_role";



GRANT ALL ON TABLE "public"."farm_crops" TO "anon";
GRANT ALL ON TABLE "public"."farm_crops" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_crops" TO "service_role";



GRANT ALL ON TABLE "public"."farms" TO "anon";
GRANT ALL ON TABLE "public"."farms" TO "authenticated";
GRANT ALL ON TABLE "public"."farms" TO "service_role";



GRANT ALL ON TABLE "public"."inquiries" TO "anon";
GRANT ALL ON TABLE "public"."inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."inquiries" TO "service_role";



GRANT ALL ON TABLE "public"."listing_media" TO "anon";
GRANT ALL ON TABLE "public"."listing_media" TO "authenticated";
GRANT ALL ON TABLE "public"."listing_media" TO "service_role";



GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."trader_profiles" TO "anon";
GRANT ALL ON TABLE "public"."trader_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."trader_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."marketplace_seller_public" TO "anon";
GRANT ALL ON TABLE "public"."marketplace_seller_public" TO "authenticated";
GRANT ALL ON TABLE "public"."marketplace_seller_public" TO "service_role";



GRANT ALL ON TABLE "public"."markets" TO "anon";
GRANT ALL ON TABLE "public"."markets" TO "authenticated";
GRANT ALL ON TABLE "public"."markets" TO "service_role";



GRANT ALL ON TABLE "public"."moderation_events" TO "anon";
GRANT ALL ON TABLE "public"."moderation_events" TO "authenticated";
GRANT ALL ON TABLE "public"."moderation_events" TO "service_role";



GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";



GRANT ALL ON TABLE "public"."waitlist" TO "anon";
GRANT ALL ON TABLE "public"."waitlist" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































