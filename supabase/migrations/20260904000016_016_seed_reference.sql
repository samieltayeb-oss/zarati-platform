-- ==============================================================================
-- Migration 016: Reference Seed Data (Production Safe)
-- Contains 18 Sudanese States, 10 Primary Agricultural Markets, and 8 Core Crops
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. 18 Sudanese States
-- ------------------------------------------------------------------------------
INSERT INTO public.states (code, name_en, name_ar, region, capital_en, capital_ar) VALUES
  ('SD-KH', 'Khartoum', 'الخرطوم', 'khartoum', 'Khartoum', 'الخرطوم'),
  ('SD-GZ', 'Gezira', 'الجزيرة', 'central', 'Wad Madani', 'ود مدني'),
  ('SD-GD', 'Gedaref', 'القضارف', 'eastern', 'Gedaref', 'القضارف'),
  ('SD-KS', 'Kassala', 'كسلا', 'eastern', 'Kassala', 'كسلا'),
  ('SD-RS', 'Red Sea', 'البحر الأحمر', 'eastern', 'Port Sudan', 'بورتسودان'),
  ('SD-SN', 'Sennar', 'سنار', 'central', 'Singa', 'سنجة'),
  ('SD-BN', 'Blue Nile', 'النيل الأزرق', 'central', 'Ad-Damazin', 'الدمازين'),
  ('SD-WN', 'White Nile', 'النيل الأبيض', 'central', 'Rabak', 'ربك'),
  ('SD-NO', 'Northern', 'الشمالية', 'northern', 'Dongola', 'دنقلا'),
  ('SD-NR', 'River Nile', 'نهر النيل', 'northern', 'Ad-Damir', 'الدامر'),
  ('SD-NK', 'North Kordofan', 'شمال كردفان', 'kordofan', 'El Obeid', 'الأبيض'),
  ('SD-SK', 'South Kordofan', 'جنوب كردفان', 'kordofan', 'Kadugli', 'كادقلي'),
  ('SD-WK', 'West Kordofan', 'غرب كردفان', 'kordofan', 'Al-Fulah', 'الفولة'),
  ('SD-ND', 'North Darfur', 'شمال دارفور', 'darfur', 'El Fasher', 'الفاشر'),
  ('SD-SD', 'South Darfur', 'جنوب دارفور', 'darfur', 'Nyala', 'نيالا'),
  ('SD-WD', 'West Darfur', 'غرب دارفور', 'darfur', 'Geneina', 'الجنينة'),
  ('SD-ED', 'East Darfur', 'شرق دارفور', 'darfur', 'Ed Daein', 'الضعين'),
  ('SD-CD', 'Central Darfur', 'وسط دارفور', 'darfur', 'Zalingei', 'زالنجي')
ON CONFLICT (code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  region = EXCLUDED.region,
  capital_en = EXCLUDED.capital_en,
  capital_ar = EXCLUDED.capital_ar;

-- ------------------------------------------------------------------------------
-- 2. 10 Primary Agricultural Markets
-- ------------------------------------------------------------------------------
INSERT INTO public.markets (state_id, code, name_en, name_ar, city_en, city_ar, market_type) VALUES
  ((SELECT id FROM public.states WHERE code = 'SD-GD'), 'MKT-GD-01', 'Gedaref Crops Market', 'سوق محاصيل القضارف', 'Gedaref', 'القضارف', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-NK'), 'MKT-OB-01', 'El Obeid Crops Exchange', 'سوق محاصيل الأبيض', 'El Obeid', 'الأبيض', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-SD'), 'MKT-NY-01', 'Nyala Crops Market', 'سوق محاصيل نيالا', 'Nyala', 'نيالا', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-SN'), 'MKT-SN-01', 'Sennar Agricultural Market', 'سوق سنار الزراعي', 'Sennar', 'سنار', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-KS'), 'MKT-KS-01', 'Kassala Central Market', 'سوق كسلا المركزي', 'Kassala', 'كسلا', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-GZ'), 'MKT-WM-01', 'Wad Madani Wholesale Market', 'سوق ود مدني للجملة', 'Wad Madani', 'ود مدني', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-WN'), 'MKT-KT-01', 'Kosti Crops Market', 'سوق محاصيل كوستي', 'Kosti', 'كوستي', 'physical'),
  ((SELECT id FROM public.states WHERE code = 'SD-RS'), 'MKT-PS-01', 'Port Sudan Terminal Market', 'سوق بورتسودان النهائي', 'Port Sudan', 'بورتسودان', 'terminal'),
  ((SELECT id FROM public.states WHERE code = 'SD-KH'), 'MKT-KH-01', 'Khartoum Central Market', 'السوق المركزي الخرطوم', 'Khartoum', 'الخرطوم', 'terminal'),
  ((SELECT id FROM public.states WHERE code = 'SD-BN'), 'MKT-DM-01', 'Ad-Damazin Crops Market', 'سوق محاصيل الدمازين', 'Ad-Damazin', 'الدمازين', 'physical')
ON CONFLICT (code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  city_en = EXCLUDED.city_en,
  city_ar = EXCLUDED.city_ar,
  market_type = EXCLUDED.market_type;

-- ------------------------------------------------------------------------------
-- 3. 8 Core Sudanese Crops
-- ------------------------------------------------------------------------------
INSERT INTO public.crops (code, name_en, name_ar, category, standard_unit, sort_order) VALUES
  ('sorghum', 'Sorghum', 'ذرة رفيعة', 'grain', 'ton', 1),
  ('millet', 'Millet', 'دخن', 'grain', 'ton', 2),
  ('sesame', 'Sesame', 'سمسم', 'oilseed', 'ton', 3),
  ('groundnuts', 'Groundnuts', 'فول سوداني', 'oilseed', 'ton', 4),
  ('cotton', 'Cotton', 'قطن', 'cash', 'ton', 5),
  ('wheat', 'Wheat', 'قمح', 'grain', 'ton', 6),
  ('gum-arabic', 'Gum Arabic', 'صمغ عربي', 'cash', 'ton', 7),
  ('sunflower', 'Sunflower', 'عباد الشمس', 'oilseed', 'ton', 8)
ON CONFLICT (code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  category = EXCLUDED.category,
  standard_unit = EXCLUDED.standard_unit,
  sort_order = EXCLUDED.sort_order;
