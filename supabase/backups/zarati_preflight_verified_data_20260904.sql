SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Sy8TKAQknVQSUl8Ha264a2Idse1IEA9EbAa4ZHirezIinHqJv6xDEERzJ124nHT

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '071cd721-233c-4d69-a508-91a6e0b5a9dc', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_name":"Ahmed Mohammed","actor_username":"sam+farmer_ahmed@nexorayyc.io","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-09-04 18:57:06.324066+00', ''),
	('00000000-0000-0000-0000-000000000000', '124dc713-84af-4b53-89fe-656d4d8d4e48', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000003","actor_name":"Hassan Ibrahim","actor_username":"sam+farmer_hassan@nexorayyc.io","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-09-04 18:57:06.39336+00', ''),
	('00000000-0000-0000-0000-000000000000', '92bc300a-341e-4d7a-94e9-31aa3171402a', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000004","actor_name":"Fatima Ahmed","actor_username":"sam+trader_fatima@nexorayyc.io","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-09-04 18:57:06.443747+00', ''),
	('00000000-0000-0000-0000-000000000000', '606acdbe-9965-4c7d-b86f-fa33d6426670', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000005","actor_name":"Omar Salih","actor_username":"sam+trader_omar@nexorayyc.io","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-09-04 18:57:06.494564+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd983a86d-9849-4390-8782-62658a83b430', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_name":"Zarati System Admin","actor_username":"sam@nexorayyc.io","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-09-04 18:57:06.548549+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'sam+farmer_ahmed@nexorayyc.io', '$2a$06$zNIYfPnfIqQMP48vURaaXeSAenyV34ZilfcySIm1MysjtXVQnaj3m', '2026-09-04 18:56:46.268355+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-09-04 18:57:06.325458+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ahmed Mohammed"}', NULL, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.329862+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'sam+farmer_hassan@nexorayyc.io', '$2a$06$.kNMW5LMo27ZDXG77PYCkuOzJCUTJR3Nzow7rhuNYBfInsmE.XpLC', '2026-09-04 18:56:46.268355+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-09-04 18:57:06.394876+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Hassan Ibrahim"}', NULL, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.398429+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'sam+trader_fatima@nexorayyc.io', '$2a$06$x24/STi3FmgbZkuA5isSXeRIMzk7eRuTVbLcmGtLbF6NILC8346e2', '2026-09-04 18:56:46.268355+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-09-04 18:57:06.445098+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fatima Ahmed"}', NULL, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.44889+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'sam+trader_omar@nexorayyc.io', '$2a$06$2lOTWAaswq/leevmsSIwAOu4BCgzxwU4PfXX5.U7OHaVWrhbAzT2q', '2026-09-04 18:56:46.268355+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-09-04 18:57:06.495678+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Omar Salih"}', NULL, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.499167+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'sam@nexorayyc.io', '$2a$06$10MBajgKkVaK/yFQz/S89u6VAFauJaxG/02QzIjhH6hA3dECG/fUu', '2026-09-04 18:56:46.268355+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-09-04 18:57:06.550329+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Zarati System Admin"}', NULL, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.553712+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('dc81acb6-c5b2-42d8-b629-f6bc04c50e31', '00000000-0000-0000-0000-000000000002', '2026-09-04 18:57:06.325664+00', '2026-09-04 18:57:06.325664+00', NULL, 'aal1', NULL, NULL, 'node', '172.22.0.1', NULL, NULL, NULL, NULL, NULL),
	('0ba069ad-3177-4769-bd35-0a8f1724b2e1', '00000000-0000-0000-0000-000000000003', '2026-09-04 18:57:06.394968+00', '2026-09-04 18:57:06.394968+00', NULL, 'aal1', NULL, NULL, 'node', '172.22.0.1', NULL, NULL, NULL, NULL, NULL),
	('57de0c41-b7aa-41b8-bde9-8586aaacfbd8', '00000000-0000-0000-0000-000000000004', '2026-09-04 18:57:06.44515+00', '2026-09-04 18:57:06.44515+00', NULL, 'aal1', NULL, NULL, 'node', '172.22.0.1', NULL, NULL, NULL, NULL, NULL),
	('242ed312-f56b-40f2-9282-04001c474f54', '00000000-0000-0000-0000-000000000005', '2026-09-04 18:57:06.495743+00', '2026-09-04 18:57:06.495743+00', NULL, 'aal1', NULL, NULL, 'node', '172.22.0.1', NULL, NULL, NULL, NULL, NULL),
	('5fb92130-2703-4640-a4f0-3c45a29d4e75', '00000000-0000-0000-0000-000000000001', '2026-09-04 18:57:06.55039+00', '2026-09-04 18:57:06.55039+00', NULL, 'aal1', NULL, NULL, 'node', '172.22.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('dc81acb6-c5b2-42d8-b629-f6bc04c50e31', '2026-09-04 18:57:06.33048+00', '2026-09-04 18:57:06.33048+00', 'password', '8721d313-b063-48dc-a3ac-9f9b218934ec'),
	('0ba069ad-3177-4769-bd35-0a8f1724b2e1', '2026-09-04 18:57:06.399021+00', '2026-09-04 18:57:06.399021+00', 'password', 'cf5f47c0-cd5c-4d12-86cc-bbbed10ab57c'),
	('57de0c41-b7aa-41b8-bde9-8586aaacfbd8', '2026-09-04 18:57:06.449495+00', '2026-09-04 18:57:06.449495+00', 'password', '1f3281db-5594-477c-b31e-fd0e67bb8a48'),
	('242ed312-f56b-40f2-9282-04001c474f54', '2026-09-04 18:57:06.499996+00', '2026-09-04 18:57:06.499996+00', 'password', '418b45d7-09c2-4f53-bfa9-0de3efb57962'),
	('5fb92130-2703-4640-a4f0-3c45a29d4e75', '2026-09-04 18:57:06.554601+00', '2026-09-04 18:57:06.554601+00', 'password', '8a707a3a-8880-4751-ab88-a89c9aa3d0f8');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'oycwzghs6oqq', '00000000-0000-0000-0000-000000000002', false, '2026-09-04 18:57:06.328426+00', '2026-09-04 18:57:06.328426+00', NULL, 'dc81acb6-c5b2-42d8-b629-f6bc04c50e31'),
	('00000000-0000-0000-0000-000000000000', 2, 'cayd4sc4yuqf', '00000000-0000-0000-0000-000000000003', false, '2026-09-04 18:57:06.397094+00', '2026-09-04 18:57:06.397094+00', NULL, '0ba069ad-3177-4769-bd35-0a8f1724b2e1'),
	('00000000-0000-0000-0000-000000000000', 3, 'sbbdl45can2j', '00000000-0000-0000-0000-000000000004', false, '2026-09-04 18:57:06.447614+00', '2026-09-04 18:57:06.447614+00', NULL, '57de0c41-b7aa-41b8-bde9-8586aaacfbd8'),
	('00000000-0000-0000-0000-000000000000', 4, 'strohv4ru5lh', '00000000-0000-0000-0000-000000000005', false, '2026-09-04 18:57:06.498068+00', '2026-09-04 18:57:06.498068+00', NULL, '242ed312-f56b-40f2-9282-04001c474f54'),
	('00000000-0000-0000-0000-000000000000', 5, 'qdxi4ireo4zx', '00000000-0000-0000-0000-000000000001', false, '2026-09-04 18:57:06.552271+00', '2026-09-04 18:57:06.552271+00', NULL, '5fb92130-2703-4640-a4f0-3c45a29d4e75');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."crops" ("id", "code", "name_en", "name_ar", "category", "standard_unit", "sort_order", "is_active", "created_at") VALUES
	('49a05530-f772-48ee-a303-0e063e84e41a', 'sorghum', 'Sorghum', 'ذرة رفيعة', 'grain', 'ton', 1, true, '2026-09-04 18:56:46.259782+00'),
	('90b620a4-f8dc-459e-8359-d6ec92e32916', 'millet', 'Millet', 'دخن', 'grain', 'ton', 2, true, '2026-09-04 18:56:46.259782+00'),
	('d8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', 'sesame', 'Sesame', 'سمسم', 'oilseed', 'ton', 3, true, '2026-09-04 18:56:46.259782+00'),
	('7426bca7-f6d5-444a-9b3d-431f67f36fc7', 'groundnuts', 'Groundnuts', 'فول سوداني', 'oilseed', 'ton', 4, true, '2026-09-04 18:56:46.259782+00'),
	('197caff4-4f37-4ebb-8e76-504f219a0017', 'cotton', 'Cotton', 'قطن', 'cash', 'ton', 5, true, '2026-09-04 18:56:46.259782+00'),
	('27cb10e2-8816-4820-b692-a95583be895f', 'wheat', 'Wheat', 'قمح', 'grain', 'ton', 6, true, '2026-09-04 18:56:46.259782+00'),
	('56a69c65-f325-4963-b726-a485a9ae31e2', 'gum-arabic', 'Gum Arabic', 'صمغ عربي', 'cash', 'ton', 7, true, '2026-09-04 18:56:46.259782+00'),
	('dc9e8d52-3fbc-4eaa-8454-876c542993a3', 'sunflower', 'Sunflower', 'عباد الشمس', 'oilseed', 'ton', 8, true, '2026-09-04 18:56:46.259782+00');


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."states" ("id", "code", "name_en", "name_ar", "region", "capital_en", "capital_ar", "is_active", "created_at") VALUES
	('b14c311e-9e55-4b83-99af-2610da90fcb7', 'SD-KH', 'Khartoum', 'الخرطوم', 'khartoum', 'Khartoum', 'الخرطوم', true, '2026-09-04 18:56:46.259782+00'),
	('ffb4b4a9-2419-40be-9ee3-e757c939b090', 'SD-GZ', 'Gezira', 'الجزيرة', 'central', 'Wad Madani', 'ود مدني', true, '2026-09-04 18:56:46.259782+00'),
	('33a24807-1b24-4a04-ac06-41e08e360b4e', 'SD-GD', 'Gedaref', 'القضارف', 'eastern', 'Gedaref', 'القضارف', true, '2026-09-04 18:56:46.259782+00'),
	('8aac2501-5044-4b38-a129-f6cd405ac1f5', 'SD-KS', 'Kassala', 'كسلا', 'eastern', 'Kassala', 'كسلا', true, '2026-09-04 18:56:46.259782+00'),
	('b0474d04-8239-475f-96bc-77266bd560c0', 'SD-RS', 'Red Sea', 'البحر الأحمر', 'eastern', 'Port Sudan', 'بورتسودان', true, '2026-09-04 18:56:46.259782+00'),
	('47abf8b6-7528-40bc-9334-13ccfae52808', 'SD-SN', 'Sennar', 'سنار', 'central', 'Singa', 'سنجة', true, '2026-09-04 18:56:46.259782+00'),
	('06bbb035-cc2b-42ad-8f2b-b27f77d1b6b2', 'SD-BN', 'Blue Nile', 'النيل الأزرق', 'central', 'Ad-Damazin', 'الدمازين', true, '2026-09-04 18:56:46.259782+00'),
	('f5678cc7-f203-4388-b025-6fea07939cc9', 'SD-WN', 'White Nile', 'النيل الأبيض', 'central', 'Rabak', 'ربك', true, '2026-09-04 18:56:46.259782+00'),
	('949be9d2-c1b8-4fe2-be16-1fe8bf37145b', 'SD-NO', 'Northern', 'الشمالية', 'northern', 'Dongola', 'دنقلا', true, '2026-09-04 18:56:46.259782+00'),
	('2fc1af29-74f7-40cf-898d-4aedc2e276d8', 'SD-NR', 'River Nile', 'نهر النيل', 'northern', 'Ad-Damir', 'الدامر', true, '2026-09-04 18:56:46.259782+00'),
	('b9c3fc24-1ee9-44e3-9e48-bd3dd8a7ba9c', 'SD-NK', 'North Kordofan', 'شمال كردفان', 'kordofan', 'El Obeid', 'الأبيض', true, '2026-09-04 18:56:46.259782+00'),
	('51bfc7f8-a4f1-44ba-bdc3-0490937e131f', 'SD-SK', 'South Kordofan', 'جنوب كردفان', 'kordofan', 'Kadugli', 'كادقلي', true, '2026-09-04 18:56:46.259782+00'),
	('a63993f6-ab3e-4050-ad23-88f25539bfab', 'SD-WK', 'West Kordofan', 'غرب كردفان', 'kordofan', 'Al-Fulah', 'الفولة', true, '2026-09-04 18:56:46.259782+00'),
	('ff9b9506-b25d-4901-91e6-6ebac9abbaa1', 'SD-ND', 'North Darfur', 'شمال دارفور', 'darfur', 'El Fasher', 'الفاشر', true, '2026-09-04 18:56:46.259782+00'),
	('4dfdd555-29a1-435c-b533-b43996c2adb5', 'SD-SD', 'South Darfur', 'جنوب دارفور', 'darfur', 'Nyala', 'نيالا', true, '2026-09-04 18:56:46.259782+00'),
	('d89ca7f2-6da1-4952-b04b-dba1bd62fb90', 'SD-WD', 'West Darfur', 'غرب دارفور', 'darfur', 'Geneina', 'الجنينة', true, '2026-09-04 18:56:46.259782+00'),
	('04e57743-5379-4c3f-a145-d52094550418', 'SD-ED', 'East Darfur', 'شرق دارفور', 'darfur', 'Ed Daein', 'الضعين', true, '2026-09-04 18:56:46.259782+00'),
	('41be9b3b-5fa3-4b3f-b377-1a3aec4844e8', 'SD-CD', 'Central Darfur', 'وسط دارفور', 'darfur', 'Zalingei', 'زالنجي', true, '2026-09-04 18:56:46.259782+00');


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."markets" ("id", "state_id", "code", "name_en", "name_ar", "city_en", "city_ar", "market_type", "is_active", "created_at") VALUES
	('99836e9a-1ce3-4349-afd6-ed739a90549d', '33a24807-1b24-4a04-ac06-41e08e360b4e', 'MKT-GD-01', 'Gedaref Crops Market', 'سوق محاصيل القضارف', 'Gedaref', 'القضارف', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('9e103d57-f52f-45e4-bb14-8b1ce241b8e3', 'b9c3fc24-1ee9-44e3-9e48-bd3dd8a7ba9c', 'MKT-OB-01', 'El Obeid Crops Exchange', 'سوق محاصيل الأبيض', 'El Obeid', 'الأبيض', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('6dcc708e-c80e-4f10-9e85-ec5e50a2e19c', '4dfdd555-29a1-435c-b533-b43996c2adb5', 'MKT-NY-01', 'Nyala Crops Market', 'سوق محاصيل نيالا', 'Nyala', 'نيالا', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('05d5e0ec-91e8-4f3c-b6ed-d5bb125ea372', '47abf8b6-7528-40bc-9334-13ccfae52808', 'MKT-SN-01', 'Sennar Agricultural Market', 'سوق سنار الزراعي', 'Sennar', 'سنار', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('a2b02e43-77f5-4739-ad04-4917f0b92777', '8aac2501-5044-4b38-a129-f6cd405ac1f5', 'MKT-KS-01', 'Kassala Central Market', 'سوق كسلا المركزي', 'Kassala', 'كسلا', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('3412f23a-3e7d-42ac-a360-7ab521112d08', 'ffb4b4a9-2419-40be-9ee3-e757c939b090', 'MKT-WM-01', 'Wad Madani Wholesale Market', 'سوق ود مدني للجملة', 'Wad Madani', 'ود مدني', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('10087cc1-1510-4c10-bfa5-4cd98e5f946a', 'f5678cc7-f203-4388-b025-6fea07939cc9', 'MKT-KT-01', 'Kosti Crops Market', 'سوق محاصيل كوستي', 'Kosti', 'كوستي', 'physical', true, '2026-09-04 18:56:46.259782+00'),
	('fa2ee294-f16f-44ec-bd7e-0287fd4f7256', 'b0474d04-8239-475f-96bc-77266bd560c0', 'MKT-PS-01', 'Port Sudan Terminal Market', 'سوق بورتسودان النهائي', 'Port Sudan', 'بورتسودان', 'terminal', true, '2026-09-04 18:56:46.259782+00'),
	('c2c61715-b782-4d12-85ec-73109a8f73db', 'b14c311e-9e55-4b83-99af-2610da90fcb7', 'MKT-KH-01', 'Khartoum Central Market', 'السوق المركزي الخرطوم', 'Khartoum', 'الخرطوم', 'terminal', true, '2026-09-04 18:56:46.259782+00'),
	('db593424-032f-4a5d-a205-8417f8f26627', '06bbb035-cc2b-42ad-8f2b-b27f77d1b6b2', 'MKT-DM-01', 'Ad-Damazin Crops Market', 'سوق محاصيل الدمازين', 'Ad-Damazin', 'الدمازين', 'physical', true, '2026-09-04 18:56:46.259782+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "role", "full_name", "full_name_ar", "phone", "email", "preferred_language", "state_id", "avatar_url", "is_verified", "metadata", "created_at", "updated_at") VALUES
	('00000000-0000-0000-0000-000000000001', 'admin', 'Zarati System Admin', 'مدير نظام زرعتي', '+249900000001', 'sam@nexorayyc.io', 'ar', 'b14c311e-9e55-4b83-99af-2610da90fcb7', NULL, true, '{}', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('00000000-0000-0000-0000-000000000002', 'farmer', 'Ahmed Mohammed', 'أحمد محمد', '+249912345678', 'sam+farmer_ahmed@nexorayyc.io', 'ar', '33a24807-1b24-4a04-ac06-41e08e360b4e', NULL, true, '{}', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('00000000-0000-0000-0000-000000000003', 'farmer', 'Hassan Ibrahim', 'حسن إبراهيم', '+249923456789', 'sam+farmer_hassan@nexorayyc.io', 'ar', '8aac2501-5044-4b38-a129-f6cd405ac1f5', NULL, true, '{}', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('00000000-0000-0000-0000-000000000004', 'trader', 'Fatima Ahmed', 'فاطمة أحمد', '+249934567890', 'sam+trader_fatima@nexorayyc.io', 'ar', 'b14c311e-9e55-4b83-99af-2610da90fcb7', NULL, true, '{}', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('00000000-0000-0000-0000-000000000005', 'trader', 'Omar Salih', 'عمر صالح', '+249945678901', 'sam+trader_omar@nexorayyc.io', 'ar', '33a24807-1b24-4a04-ac06-41e08e360b4e', NULL, true, '{}', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00');


--
-- Data for Name: crop_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."crop_prices" ("id", "crop_id", "market_id", "price_sdg", "price_usd", "currency", "unit", "price_date", "source", "is_official", "notes", "created_by", "created_at") VALUES
	('0c7ae78f-b6bc-497a-9448-d561cf471f8c', '49a05530-f772-48ee-a303-0e063e84e41a', '99836e9a-1ce3-4349-afd6-ed739a90549d', 82500.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('33ec404e-0812-40a0-b7fa-5a415e1becc3', '90b620a4-f8dc-459e-8359-d6ec92e32916', '9e103d57-f52f-45e4-bb14-8b1ce241b8e3', 78000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('0fa7e546-11e4-45cb-a060-07a68eccede1', 'd8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', '99836e9a-1ce3-4349-afd6-ed739a90549d', 320000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('ccead9b0-e971-4781-a68a-63ccdf1ce8c0', '7426bca7-f6d5-444a-9b3d-431f67f36fc7', 'a2b02e43-77f5-4739-ad04-4917f0b92777', 185000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('d7642e8f-108e-4363-9b51-72f86cc85d6f', '197caff4-4f37-4ebb-8e76-504f219a0017', '3412f23a-3e7d-42ac-a360-7ab521112d08', 245000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('4ef6a836-f790-4bae-98fa-a7df1cea10c0', '27cb10e2-8816-4820-b692-a95583be895f', 'c2c61715-b782-4d12-85ec-73109a8f73db', 88000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('80730ae5-2d72-4ee5-a7db-9149d38600d9', '56a69c65-f325-4963-b726-a485a9ae31e2', 'c2c61715-b782-4d12-85ec-73109a8f73db', 410000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('326745bf-3164-48f8-b658-986bebc33e11', 'dc9e8d52-3fbc-4eaa-8454-876c542993a3', '05d5e0ec-91e8-4f3c-b6ed-d5bb125ea372', 142000.00, NULL, 'SDG', 'ton', '2026-09-04', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('7775a2de-2132-47e9-bc84-127d50d27593', '49a05530-f772-48ee-a303-0e063e84e41a', '99836e9a-1ce3-4349-afd6-ed739a90549d', 81300.00, NULL, 'SDG', 'ton', '2026-09-03', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('fbe12893-05ec-4fb8-bd21-e7bc199484b2', '49a05530-f772-48ee-a303-0e063e84e41a', '99836e9a-1ce3-4349-afd6-ed739a90549d', 81000.00, NULL, 'SDG', 'ton', '2026-09-02', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('6554304e-5e4d-436b-a8b4-7c7f7e232c08', '49a05530-f772-48ee-a303-0e063e84e41a', '99836e9a-1ce3-4349-afd6-ed739a90549d', 80500.00, NULL, 'SDG', 'ton', '2026-09-01', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('16a0038a-8840-4713-8cfd-41a038ae9eab', 'd8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', '99836e9a-1ce3-4349-afd6-ed739a90549d', 315000.00, NULL, 'SDG', 'ton', '2026-09-03', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('24bcb656-dcfc-4035-8593-f12ba6c01b81', 'd8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', '99836e9a-1ce3-4349-afd6-ed739a90549d', 312000.00, NULL, 'SDG', 'ton', '2026-09-02', 'market_authority', true, NULL, NULL, '2026-09-04 18:56:46.268355+00'),
	('6fbe71f0-46bc-4e6d-b097-ff53bceba645', '27cb10e2-8816-4820-b692-a95583be895f', 'c2c61715-b782-4d12-85ec-73109a8f73db', 89500.00, NULL, 'SDG', 'ton', '2026-09-05', 'admin_override', true, NULL, '00000000-0000-0000-0000-000000000001', '2026-09-04 18:57:06.918157+00');


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."farms" ("id", "farmer_id", "name", "name_ar", "state_id", "locality", "area_value", "area_unit", "irrigation_type", "soil_type", "latitude", "longitude", "is_verified", "created_at", "updated_at") VALUES
	('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Hassan Kassala Sesame Scheme', 'مشروع حسن للسمسم بكسلا', '8aac2501-5044-4b38-a129-f6cd405ac1f5', 'Al-Gash', 250.00, 'feddan', 'flood_spate', 'alluvial', NULL, NULL, true, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Ahmed Gedaref Sorghum Farm', 'مزرعة أحمد للذرة بالقضارف', '33a24807-1b24-4a04-ac06-41e08e360b4e', 'Al-Fashaga Sector A', 500.00, 'feddan', 'rainfed', 'clay', NULL, NULL, true, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:57:06.734985+00');


--
-- Data for Name: farm_crops; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."listings" ("id", "user_id", "category", "crop_id", "title_en", "title_ar", "description_en", "description_ar", "price", "currency", "unit", "quantity", "state_id", "market_id", "location_name_en", "location_name_ar", "status", "featured", "views_count", "inquiries_count", "expires_at", "created_at", "updated_at") VALUES
	('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'crops', '49a05530-f772-48ee-a303-0e063e84e41a', 'Sorghum — 50 Tons', 'ذرة رفيعة — ٥٠ طن', 'High-quality sorghum from Gedaref region, freshly harvested.', 'ذرة رفيعة عالية الجودة من منطقة القضارف، محصولة هذا الموسم.', 82500.00, 'SDG', 'ton', 50.00, '33a24807-1b24-4a04-ac06-41e08e360b4e', '99836e9a-1ce3-4349-afd6-ed739a90549d', 'Gedaref', 'القضارف', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'crops', 'd8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', 'Premium Sesame — 20 Tons', 'سمسم ممتاز — ٢٠ طن', 'Export-grade white sesame from Kassala, cleaned and ready for shipment.', 'سمسم أبيض بجودة تصديرية من كسلا، منظف وجاهز للشحن.', 320000.00, 'SDG', 'ton', 20.00, '8aac2501-5044-4b38-a129-f6cd405ac1f5', 'a2b02e43-77f5-4739-ad04-4917f0b92777', 'Kassala', 'كسلا', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'equipment', NULL, 'John Deere 5M Tractor — For Rent', 'جرار جون دير ٥م — للإيجار', '2023 John Deere 5M tractor available for seasonal rental. Driver included.', 'جرار جون دير ٥م موديل ٢٠٢٣ متاح للإيجار الموسمي. يشمل السائق.', 15000.00, 'SDG', 'day', 1.00, 'b14c311e-9e55-4b83-99af-2610da90fcb7', NULL, 'Khartoum', 'الخرطوم', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'equipment', NULL, 'Irrigation Water Pump 6"', 'مضخة مياه للري ٦ بوصة', 'Heavy-duty diesel irrigation pump, 6-inch outlet, excellent condition.', 'مضخة ري ديزل ثقيلة، منفذ ٦ بوصة، حالة ممتازة.', 850000.00, 'SDG', 'unit', 2.00, '33a24807-1b24-4a04-ac06-41e08e360b4e', NULL, 'Gedaref', 'القضارف', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'seeds', 'd8e8017e-a4f3-4f8a-b614-74bbe8e2ad71', 'Certified Sesame Seeds', 'بذور سمسم معتمدة', 'Ministry of Agriculture certified sesame seeds, 92% germination rate.', 'بذور سمسم معتمدة من وزارة الزراعة، نسبة إنبات ٩٢٪.', 45000.00, 'SDG', 'bag (50kg)', 100.00, 'ffb4b4a9-2419-40be-9ee3-e757c939b090', NULL, 'Gezira', 'الجزيرة', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'seeds', '49a05530-f772-48ee-a303-0e063e84e41a', 'High-Yield Sorghum Seeds', 'بذور ذرة عالية الإنتاج', 'Improved drought-tolerant sorghum variety, suited for semi-arid regions.', 'صنف ذرة محسّن ومتحمل للجفاف، مناسب للمناطق شبه الجافة.', 28000.00, 'SDG', 'bag (25kg)', 200.00, 'b9c3fc24-1ee9-44e3-9e48-bd3dd8a7ba9c', NULL, 'El Obeid', 'الأبيض', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'fertilizer', NULL, 'DAP Fertilizer — 50kg Bags', 'سماد DAP — أكياس ٥٠ كغ', 'Diammonium phosphate (18-46-0), suitable for pre-planting application.', 'فوسفات الأمونيوم الثنائي (18-46-0)، مناسب للتطبيق قبل الزراعة.', 32000.00, 'SDG', 'bag (50kg)', 500.00, 'b14c311e-9e55-4b83-99af-2610da90fcb7', NULL, 'Khartoum', 'الخرطوم', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'fertilizer', NULL, 'Urea Fertilizer (46% N)', 'يوريا (٤٦٪ نيتروجين)', 'Granular urea, 46% nitrogen content, ideal for top-dressing.', 'يوريا حبيبية، نيتروجين ٤٦٪، مثالية للتسميد السطحي.', 28500.00, 'SDG', 'bag (50kg)', 300.00, '33a24807-1b24-4a04-ac06-41e08e360b4e', NULL, 'Gedaref', 'القضارف', 'active', false, 0, 0, '2026-10-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00');


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."inquiries" ("id", "listing_id", "buyer_id", "seller_id", "offered_price", "requested_quantity", "message", "contact_phone", "status", "created_at", "updated_at") VALUES
	('93dbb1e3-9886-4d84-9b76-b3759122754e', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 80000.00, 50.00, 'Trader A offering 80,000 SDG/ton for entire lot.', NULL, 'pending', '2026-09-04 18:57:06.818972+00', '2026-09-04 18:57:06.818972+00');


--
-- Data for Name: listing_media; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: moderation_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."moderation_events" ("id", "entity_type", "entity_id", "action", "reason", "moderator_id", "created_at") VALUES
	('c57fb52b-3046-474c-a3ee-ef09fcda0b04', 'listing', '20000000-0000-0000-0000-000000000001', 'approved', 'Physical harvest verified by regional inspector in Gedaref', '00000000-0000-0000-0000-000000000001', '2026-09-04 18:57:06.928154+00');


--
-- Data for Name: trader_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."trader_profiles" ("id", "business_name", "business_name_ar", "registration_number", "tax_id", "trader_type", "operating_markets", "commodities_of_interest", "is_verified_trader", "rating", "total_deals_completed", "created_at", "updated_at") VALUES
	('00000000-0000-0000-0000-000000000004', 'Al-Baraka Agricultural Trading', 'شركة البركة لتجارة المحاصيل', NULL, NULL, 'exporter', '[]', '[]', true, 4.70, 32, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00'),
	('00000000-0000-0000-0000-000000000005', 'Gedaref Ag Supplies & Equipment', 'مؤسسة القضارف للمدخلات والمعدات', NULL, NULL, 'wholesaler', '[]', '[]', true, 4.60, 19, '2026-09-04 18:56:46.268355+00', '2026-09-04 18:56:46.268355+00');


--
-- Data for Name: waitlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."waitlist" ("id", "name", "email", "role", "language", "created_at") VALUES
	('165ba5e7-19d7-42bb-9ebf-2f507a7cb954', 'Dr. Omer Idris', 'sam+waitlist_1788548226932@nexorayyc.io', 'investor', 'ar', '2026-09-04 18:57:06.935162+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Sy8TKAQknVQSUl8Ha264a2Idse1IEA9EbAa4ZHirezIinHqJv6xDEERzJ124nHT

RESET ALL;
