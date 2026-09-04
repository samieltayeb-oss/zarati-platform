-- ==============================================================================
-- Migration 017: Development & Staging Mock Parity Seed (STAGING/LOCAL ONLY)
-- STRICTLY FORBIDDEN IN PRODUCTION
-- ==============================================================================

DO $$
BEGIN
  -- Check if we are running in local/staging environment
  -- This provides a safeguard if accidentally executed
  RAISE NOTICE 'Executing 017_seed_mock_parity for Local/Staging environment...';
END $$;

-- ------------------------------------------------------------------------------
-- 1. Create Test Authentication Identities in auth.users
-- ------------------------------------------------------------------------------
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam@nexorayyc.io', crypt('AdminPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Zarati System Admin"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam+farmer_ahmed@nexorayyc.io', crypt('FarmerPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmed Mohammed"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam+farmer_hassan@nexorayyc.io', crypt('FarmerPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hassan Ibrahim"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam+trader_fatima@nexorayyc.io', crypt('TraderPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Fatima Ahmed"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam+trader_omar@nexorayyc.io', crypt('TraderPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Omar Salih"}', NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Populate Profiles
-- ------------------------------------------------------------------------------
INSERT INTO public.profiles (
  id, role, full_name, full_name_ar, phone, email, preferred_language, state_id, is_verified
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Zarati System Admin', 'مدير نظام زرعتي', '+249900000001', 'sam@nexorayyc.io', 'ar', (SELECT id FROM public.states WHERE code = 'SD-KH'), true),
  ('00000000-0000-0000-0000-000000000002', 'farmer', 'Ahmed Mohammed', 'أحمد محمد', '+249912345678', 'sam+farmer_ahmed@nexorayyc.io', 'ar', (SELECT id FROM public.states WHERE code = 'SD-GD'), true),
  ('00000000-0000-0000-0000-000000000003', 'farmer', 'Hassan Ibrahim', 'حسن إبراهيم', '+249923456789', 'sam+farmer_hassan@nexorayyc.io', 'ar', (SELECT id FROM public.states WHERE code = 'SD-KS'), true),
  ('00000000-0000-0000-0000-000000000004', 'trader', 'Fatima Ahmed', 'فاطمة أحمد', '+249934567890', 'sam+trader_fatima@nexorayyc.io', 'ar', (SELECT id FROM public.states WHERE code = 'SD-KH'), true),
  ('00000000-0000-0000-0000-000000000005', 'trader', 'Omar Salih', 'عمر صالح', '+249945678901', 'sam+trader_omar@nexorayyc.io', 'ar', (SELECT id FROM public.states WHERE code = 'SD-GD'), true)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  full_name_ar = EXCLUDED.full_name_ar,
  phone = EXCLUDED.phone;

-- ------------------------------------------------------------------------------
-- 3. Populate Trader Profiles
-- ------------------------------------------------------------------------------
INSERT INTO public.trader_profiles (
  id, business_name, business_name_ar, trader_type, is_verified_trader, rating, total_deals_completed
) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Al-Baraka Agricultural Trading', 'شركة البركة لتجارة المحاصيل', 'exporter', true, 4.70, 32),
  ('00000000-0000-0000-0000-000000000005', 'Gedaref Ag Supplies & Equipment', 'مؤسسة القضارف للمدخلات والمعدات', 'wholesaler', true, 4.60, 19)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Sample Farms
-- ------------------------------------------------------------------------------
INSERT INTO public.farms (
  id, farmer_id, name, name_ar, state_id, locality, area_value, area_unit, irrigation_type, soil_type, is_verified
) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Ahmed Gedaref Sorghum Farm', 'مزرعة أحمد للذرة بالقضارف', (SELECT id FROM public.states WHERE code = 'SD-GD'), 'Al-Fashaga', 500.00, 'feddan', 'rainfed', 'clay', true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Hassan Kassala Sesame Scheme', 'مشروع حسن للسمسم بكسلا', (SELECT id FROM public.states WHERE code = 'SD-KS'), 'Al-Gash', 250.00, 'feddan', 'flood_spate', 'alluvial', true)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Crop Prices Parity with lib/mock-data/crops.ts
-- ------------------------------------------------------------------------------
INSERT INTO public.crop_prices (
  crop_id, market_id, price_sdg, currency, unit, price_date, source, is_official
) VALUES
  ((SELECT id FROM public.crops WHERE code = 'sorghum'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 82500, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'millet'), (SELECT id FROM public.markets WHERE code = 'MKT-OB-01'), 78000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sesame'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 320000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'groundnuts'), (SELECT id FROM public.markets WHERE code = 'MKT-KS-01'), 185000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'cotton'), (SELECT id FROM public.markets WHERE code = 'MKT-WM-01'), 245000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'wheat'), (SELECT id FROM public.markets WHERE code = 'MKT-KH-01'), 88000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'gum-arabic'), (SELECT id FROM public.markets WHERE code = 'MKT-KH-01'), 410000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sunflower'), (SELECT id FROM public.markets WHERE code = 'MKT-SN-01'), 142000, 'SDG', 'ton', CURRENT_DATE, 'market_authority', true)
ON CONFLICT (crop_id, market_id, price_date, unit) DO UPDATE SET
  price_sdg = EXCLUDED.price_sdg;

-- Historical 7-day prices for Sorghum and Sesame
INSERT INTO public.crop_prices (crop_id, market_id, price_sdg, currency, unit, price_date, source, is_official) VALUES
  ((SELECT id FROM public.crops WHERE code = 'sorghum'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 81300, 'SDG', 'ton', CURRENT_DATE - 1, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sorghum'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 81000, 'SDG', 'ton', CURRENT_DATE - 2, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sorghum'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 80500, 'SDG', 'ton', CURRENT_DATE - 3, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sesame'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 315000, 'SDG', 'ton', CURRENT_DATE - 1, 'market_authority', true),
  ((SELECT id FROM public.crops WHERE code = 'sesame'), (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 312000, 'SDG', 'ton', CURRENT_DATE - 2, 'market_authority', true)
ON CONFLICT (crop_id, market_id, price_date, unit) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. 8 Marketplace Listings Parity with lib/mock-data/marketplace.ts
-- ------------------------------------------------------------------------------
INSERT INTO public.listings (
  id, user_id, category, crop_id, title_en, title_ar, description_en, description_ar,
  price, currency, unit, quantity, state_id, market_id, location_name_en, location_name_ar, status
) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'crops',
   (SELECT id FROM public.crops WHERE code = 'sorghum'),
   'Sorghum — 50 Tons', 'ذرة رفيعة — ٥٠ طن',
   'High-quality sorghum from Gedaref region, freshly harvested.',
   'ذرة رفيعة عالية الجودة من منطقة القضارف، محصولة هذا الموسم.',
   82500, 'SDG', 'ton', 50, (SELECT id FROM public.states WHERE code = 'SD-GD'),
   (SELECT id FROM public.markets WHERE code = 'MKT-GD-01'), 'Gedaref', 'القضارف', 'active'),

  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'crops',
   (SELECT id FROM public.crops WHERE code = 'sesame'),
   'Premium Sesame — 20 Tons', 'سمسم ممتاز — ٢٠ طن',
   'Export-grade white sesame from Kassala, cleaned and ready for shipment.',
   'سمسم أبيض بجودة تصديرية من كسلا، منظف وجاهز للشحن.',
   320000, 'SDG', 'ton', 20, (SELECT id FROM public.states WHERE code = 'SD-KS'),
   (SELECT id FROM public.markets WHERE code = 'MKT-KS-01'), 'Kassala', 'كسلا', 'active'),

  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'equipment',
   NULL,
   'John Deere 5M Tractor — For Rent', 'جرار جون دير ٥م — للإيجار',
   '2023 John Deere 5M tractor available for seasonal rental. Driver included.',
   'جرار جون دير ٥م موديل ٢٠٢٣ متاح للإيجار الموسمي. يشمل السائق.',
   15000, 'SDG', 'day', 1, (SELECT id FROM public.states WHERE code = 'SD-KH'),
   NULL, 'Khartoum', 'الخرطوم', 'active'),

  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'equipment',
   NULL,
   'Irrigation Water Pump 6"', 'مضخة مياه للري ٦ بوصة',
   'Heavy-duty diesel irrigation pump, 6-inch outlet, excellent condition.',
   'مضخة ري ديزل ثقيلة، منفذ ٦ بوصة، حالة ممتازة.',
   850000, 'SDG', 'unit', 2, (SELECT id FROM public.states WHERE code = 'SD-GD'),
   NULL, 'Gedaref', 'القضارف', 'active'),

  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'seeds',
   (SELECT id FROM public.crops WHERE code = 'sesame'),
   'Certified Sesame Seeds', 'بذور سمسم معتمدة',
   'Ministry of Agriculture certified sesame seeds, 92% germination rate.',
   'بذور سمسم معتمدة من وزارة الزراعة، نسبة إنبات ٩٢٪.',
   45000, 'SDG', 'bag (50kg)', 100, (SELECT id FROM public.states WHERE code = 'SD-GZ'),
   NULL, 'Gezira', 'الجزيرة', 'active'),

  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'seeds',
   (SELECT id FROM public.crops WHERE code = 'sorghum'),
   'High-Yield Sorghum Seeds', 'بذور ذرة عالية الإنتاج',
   'Improved drought-tolerant sorghum variety, suited for semi-arid regions.',
   'صنف ذرة محسّن ومتحمل للجفاف، مناسب للمناطق شبه الجافة.',
   28000, 'SDG', 'bag (25kg)', 200, (SELECT id FROM public.states WHERE code = 'SD-NK'),
   NULL, 'El Obeid', 'الأبيض', 'active'),

  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'fertilizer',
   NULL,
   'DAP Fertilizer — 50kg Bags', 'سماد DAP — أكياس ٥٠ كغ',
   'Diammonium phosphate (18-46-0), suitable for pre-planting application.',
   'فوسفات الأمونيوم الثنائي (18-46-0)، مناسب للتطبيق قبل الزراعة.',
   32000, 'SDG', 'bag (50kg)', 500, (SELECT id FROM public.states WHERE code = 'SD-KH'),
   NULL, 'Khartoum', 'الخرطوم', 'active'),

  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'fertilizer',
   NULL,
   'Urea Fertilizer (46% N)', 'يوريا (٤٦٪ نيتروجين)',
   'Granular urea, 46% nitrogen content, ideal for top-dressing.',
   'يوريا حبيبية، نيتروجين ٤٦٪، مثالية للتسميد السطحي.',
   28500, 'SDG', 'bag (50kg)', 300, (SELECT id FROM public.states WHERE code = 'SD-GD'),
   NULL, 'Gedaref', 'القضارف', 'active')
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity;
