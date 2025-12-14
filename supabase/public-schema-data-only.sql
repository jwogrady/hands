INSERT INTO "public"."address_history" ("id", "user_id", "street", "city", "state", "zip", "start_date", "end_date", "created_at", "updated_at") VALUES
	('7deb3c19-599c-4476-9294-b38ba57dfbb1', '8406cf66-046d-452d-800c-a6d7a914579f', '456 Oak Ave', 'Chicago', 'IL', '60601', '2021-03-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('be442f71-bcdd-4adb-a092-408f6fb53fde', '8406cf66-046d-452d-800c-a6d7a914579f', '789 Previous St', 'Chicago', 'IL', '60602', '2019-03-01', '2021-02-28', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('7a975916-85a2-498e-80fa-bc40cb6887be', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '789 Elm St', 'Peoria', 'IL', '61601', '2020-07-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('95d5d31a-5dad-445f-8258-6d7b47088775', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '321 Old Ave', 'Peoria', 'IL', '61602', '2018-07-01', '2020-06-30', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d5da6e43-0186-4b57-a63c-e94686a07721', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '321 Pine Rd', 'Rockford', 'IL', '61101', '2020-11-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('484bf05d-14e8-470a-8aee-d6f03d6cdbd5', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', '654 Maple Dr', 'Naperville', 'IL', '60540', '2019-02-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b43b5d89-736c-47c8-ba9b-6f4955b97ae2', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', '987 Cedar Ln', 'Aurora', 'IL', '60502', '2020-08-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('a571c787-983a-456e-bfa6-c1086e66b92d', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', '654 Past St', 'Aurora', 'IL', '60503', '2018-08-01', '2020-07-31', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('ee588f99-b0a4-42de-bae7-42eac44b6b06', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', '147 Birch Way', 'Joliet', 'IL', '60431', '2020-04-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e89dae93-9299-416c-941e-6a3b1a2f6c08', '81d919d7-f558-4d84-bced-e9659828c08e', '123 Main St', 'Springfield', 'IL', '62701', '2023-06-01', NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e6bb95a5-5ec7-47f9-8a1c-8e1969ee4e2b', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', '12123 North Colfax', 'Plano', 'Texas', '75075', '2022-02-01', NULL, '2025-12-14 03:58:12.794598+00', '2025-12-14 03:58:12.794598+00');


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("id", "title", "description", "requirements", "created_by", "created_at", "updated_at", "is_active") VALUES
	('a1b2c3d4-e5f6-4789-a012-345678901234', 'CDL Class A Driver', 'We are seeking an experienced CDL Class A driver for long-haul routes. Must have 2+ years experience and clean driving record.', 'CDL Class A license, 2+ years experience, Clean driving record, DOT physical', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', '2025-09-15 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00', true),
	('b2c3d4e5-f6a7-4890-b123-456789012345', 'Local Delivery Driver', 'Local delivery driver position with flexible hours. Great for drivers looking for home time.', 'CDL Class B license, 1+ years experience', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', '2025-10-15 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00', true),
	('c3d4e5f6-a7b8-4901-c234-567890123456', 'Regional Truck Driver', 'Regional routes with weekends home. Competitive pay and benefits package.', 'CDL Class A license, 3+ years experience, Hazmat endorsement preferred', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', '2025-11-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00', true),
	('d4e5f6a7-b8c9-4012-d345-678901234567', 'Tanker Driver', 'Experienced tanker driver needed for specialized freight transport.', 'CDL Class A license, Tanker endorsement, 5+ years experience', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', '2025-08-16 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00', false);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applications" ("id", "job_id", "candidate_id", "status", "submitted_at", "reviewed_at", "reviewed_by", "notes", "created_at", "updated_at") VALUES
	('11111111-1111-4111-a111-111111111111', 'a1b2c3d4-e5f6-4789-a012-345678901234', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'submitted', '2025-12-09 03:02:12.931062+00', NULL, NULL, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('22222222-2222-4222-a222-222222222222', 'a1b2c3d4-e5f6-4789-a012-345678901234', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'under_review', '2025-12-04 03:02:12.931062+00', '2025-12-12 03:02:12.931062+00', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Strong candidate, checking references', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('33333333-3333-4333-a333-333333333333', 'b2c3d4e5-f6a7-4890-b123-456789012345', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'approved', '2025-11-14 03:02:12.931062+00', '2025-11-19 03:02:12.931062+00', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Excellent candidate. All checks passed. Start date: Next Monday', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('44444444-4444-4444-a444-444444444444', 'a1b2c3d4-e5f6-4789-a012-345678901234', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'rejected', '2025-11-29 03:02:12.931062+00', '2025-12-04 03:02:12.931062+00', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Does not meet minimum experience requirements', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('55555555-5555-4555-a555-555555555555', 'c3d4e5f6-a7b8-4901-c234-567890123456', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'more_info_requested', '2025-11-24 03:02:12.931062+00', '2025-11-26 03:02:12.931062+00', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Need clarification on availability and previous employment gap', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('2d29b9fc-2e73-4e79-ac20-15701f4bb53a', 'c3d4e5f6-a7b8-4901-c234-567890123456', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'more_info_requested', '2025-12-14 03:50:42.957884+00', '2025-12-14 03:51:55.556+00', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', NULL, '2025-12-14 03:50:42.957884+00', '2025-12-14 03:51:55.556+00'),
	('ae4664e4-2ca5-436f-a73d-2e2a8bb38886', 'a1b2c3d4-e5f6-4789-a012-345678901234', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'submitted', '2025-12-14 04:19:01.555341+00', NULL, NULL, NULL, '2025-12-14 04:19:01.555341+00', '2025-12-14 04:19:01.555341+00'),
	('38aa48b9-a53f-4a97-8c37-9328a1a8c9a6', 'c3d4e5f6-a7b8-4901-c234-567890123456', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'submitted', '2025-12-14 04:19:12.133752+00', NULL, NULL, NULL, '2025-12-14 04:19:12.133752+00', '2025-12-14 04:19:12.133752+00');


--
-- Data for Name: job_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."job_questions" ("id", "job_id", "question", "question_type", "required", "order", "options", "created_at") VALUES
	('1ad7dfad-1a73-411c-80ed-392a72aa21f4', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'Do you have a Hazmat endorsement?', 'checkbox', true, 0, NULL, '2025-12-14 03:02:12.931062+00'),
	('29646a2f-2bff-4117-a1ce-eb56cddb792c', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'How many years of long-haul experience do you have?', 'select', true, 1, '["0-1 years", "2-5 years", "5-10 years", "10+ years"]', '2025-12-14 03:02:12.931062+00'),
	('0bad1285-224e-4372-a991-244e38c19f2b', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'Are you willing to work weekends?', 'checkbox', true, 2, NULL, '2025-12-14 03:02:12.931062+00'),
	('459c4766-8a5b-47ae-8e82-c1479347094b', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'Why are you interested in this position?', 'textarea', false, 3, NULL, '2025-12-14 03:02:12.931062+00'),
	('bf2a618e-8ab4-40cc-bf38-0f26d1f8e029', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'What is your preferred shift?', 'select', true, 0, '["Morning", "Afternoon", "Evening", "Flexible"]', '2025-12-14 03:02:12.931062+00'),
	('a93c0efd-f469-41f9-bb8b-8eb8ef44278c', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'Do you have experience with local delivery routes?', 'checkbox', true, 1, NULL, '2025-12-14 03:02:12.931062+00');


--
-- Data for Name: application_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."application_answers" ("id", "application_id", "question_id", "answer", "created_at") VALUES
	('4cd77a03-e43f-4a8f-84bd-77854433509e', '11111111-1111-4111-a111-111111111111', '1ad7dfad-1a73-411c-80ed-392a72aa21f4', 'true', '2025-12-14 03:02:12.931062+00'),
	('8ab83092-e28f-41a8-9b59-275dc94ccc87', '11111111-1111-4111-a111-111111111111', '29646a2f-2bff-4117-a1ce-eb56cddb792c', '2-5 years', '2025-12-14 03:02:12.931062+00'),
	('0c513f1e-6a39-442d-a057-c0356a69eb50', '11111111-1111-4111-a111-111111111111', '0bad1285-224e-4372-a991-244e38c19f2b', 'true', '2025-12-14 03:02:12.931062+00'),
	('fd514d20-f6c8-4242-81a8-3c6f9471f0e6', '22222222-2222-4222-a222-222222222222', '1ad7dfad-1a73-411c-80ed-392a72aa21f4', 'true', '2025-12-14 03:02:12.931062+00'),
	('fe022404-d511-4a64-a9a6-28b4fc7f7974', '22222222-2222-4222-a222-222222222222', '29646a2f-2bff-4117-a1ce-eb56cddb792c', '5-10 years', '2025-12-14 03:02:12.931062+00'),
	('f929c94a-8498-418f-83ff-da2db4007ceb', '33333333-3333-4333-a333-333333333333', 'bf2a618e-8ab4-40cc-bf38-0f26d1f8e029', 'Morning', '2025-12-14 03:02:12.931062+00'),
	('c5b58d41-6f4a-4a4c-a66b-c111495746a9', '33333333-3333-4333-a333-333333333333', 'a93c0efd-f469-41f9-bb8b-8eb8ef44278c', 'true', '2025-12-14 03:02:12.931062+00'),
	('8d7a2960-4254-41e0-be07-f338e42f81fc', 'ae4664e4-2ca5-436f-a73d-2e2a8bb38886', '1ad7dfad-1a73-411c-80ed-392a72aa21f4', 'no', '2025-12-14 04:19:01.564123+00'),
	('6e2d72e8-79cc-45dd-a0df-f4e61dc161f5', 'ae4664e4-2ca5-436f-a73d-2e2a8bb38886', '29646a2f-2bff-4117-a1ce-eb56cddb792c', '2-5 years', '2025-12-14 04:19:01.573246+00'),
	('31b2b3b8-5ee5-4b3e-a78b-51f437c9212e', 'ae4664e4-2ca5-436f-a73d-2e2a8bb38886', '0bad1285-224e-4372-a991-244e38c19f2b', 'yes', '2025-12-14 04:19:01.58083+00'),
	('8a6be936-f565-4a80-89a3-c67404cf9f77', 'ae4664e4-2ca5-436f-a73d-2e2a8bb38886', '459c4766-8a5b-47ae-8e82-c1479347094b', 'Money', '2025-12-14 04:19:01.587708+00');


--
-- Data for Name: authorizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."authorizations" ("id", "user_id", "authorization_type", "signed", "signed_at", "ip_address", "user_agent", "created_at", "updated_at") VALUES
	('7cc395cb-812c-427d-ae23-c155b539ad92', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'applicant_certification', true, '2025-12-14 04:07:10.336+00', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-14 04:07:10.37909+00', '2025-12-14 04:07:10.336+00'),
	('6fc4f524-8bcd-4f23-84f2-9ebd4e51b33b', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'hireright_background', true, '2025-12-14 04:07:13.205+00', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-14 04:07:13.237166+00', '2025-12-14 04:07:13.206+00'),
	('a3575495-22e9-4e90-86ef-6745624b6660', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'psp_authorization', true, '2025-12-14 04:07:15.183+00', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-14 04:07:15.205289+00', '2025-12-14 04:07:15.183+00'),
	('94a16468-d136-46d4-9182-2425f27c34b9', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'fmcsa_clearinghouse', true, '2025-12-14 04:07:11.447+00', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', '2025-12-14 04:07:11.485519+00', '2025-12-14 04:07:11.447+00'),
	('1d4a6999-e2e2-4630-a864-b8c1e1707b97', '8406cf66-046d-452d-800c-a6d7a914579f', 'applicant_certification', true, '2025-11-14 03:02:12.931062+00', '192.168.1.100', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('1f3b336c-587e-419b-94e8-f3c35e7eed4f', '8406cf66-046d-452d-800c-a6d7a914579f', 'fmcsa_clearinghouse', true, '2025-11-14 03:02:12.931062+00', '192.168.1.100', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('12ae5c26-fa7b-42a3-9b0f-c084c128a8cf', '8406cf66-046d-452d-800c-a6d7a914579f', 'hireright_background', true, '2025-11-14 03:02:12.931062+00', '192.168.1.100', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('aa160a87-5087-4076-948d-349e76c02590', '8406cf66-046d-452d-800c-a6d7a914579f', 'psp_authorization', true, '2025-11-14 03:02:12.931062+00', '192.168.1.100', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('922b2c71-e360-408c-80fc-2168cb2166fe', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'applicant_certification', true, '2025-10-30 03:02:12.931062+00', '192.168.1.101', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('8adc06d5-5ed8-4601-9f61-a244ba0584c2', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'fmcsa_clearinghouse', true, '2025-10-30 03:02:12.931062+00', '192.168.1.101', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b50b4b97-24a2-49a7-86b8-903882686141', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'hireright_background', true, '2025-10-30 03:02:12.931062+00', '192.168.1.101', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('4af53265-a2c7-43b5-b7a0-a8e9940b9d77', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'psp_authorization', true, '2025-10-30 03:02:12.931062+00', '192.168.1.101', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('aeb7b59c-3e14-42ac-b847-0b6e991b024d', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'applicant_certification', true, '2025-11-24 03:02:12.931062+00', '192.168.1.102', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('73e1c8f3-8f96-465d-af4f-c8366517a3e2', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'fmcsa_clearinghouse', true, '2025-11-24 03:02:12.931062+00', '192.168.1.102', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('dc5d68b9-0219-463e-ad74-499b778255b7', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'hireright_background', true, '2025-11-24 03:02:12.931062+00', '192.168.1.102', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('404bbdfd-7fb5-4589-9fee-f071c0bfe3fa', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'psp_authorization', true, '2025-11-24 03:02:12.931062+00', '192.168.1.102', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('621a5df9-85f2-4b89-828a-922680c7e876', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'applicant_certification', true, '2025-10-15 03:02:12.931062+00', '192.168.1.103', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e454c765-ad8a-469c-8b31-6c3e3ec1b7cd', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'fmcsa_clearinghouse', true, '2025-10-15 03:02:12.931062+00', '192.168.1.103', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('8c45505d-2a30-41c4-8428-fd15756a10f3', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'hireright_background', true, '2025-10-15 03:02:12.931062+00', '192.168.1.103', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('dcc5c74f-a256-4619-9af6-afe73fcc474d', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'psp_authorization', true, '2025-10-15 03:02:12.931062+00', '192.168.1.103', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('86a5b059-0b6d-40fa-969e-5cb9746d7dde', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'applicant_certification', true, '2025-11-19 03:02:12.931062+00', '192.168.1.104', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('13ebd307-386a-45aa-a6a6-90c018221690', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'fmcsa_clearinghouse', true, '2025-11-19 03:02:12.931062+00', '192.168.1.104', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('5458d1b6-947b-4f31-9860-4cd44c48db26', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'hireright_background', true, '2025-11-19 03:02:12.931062+00', '192.168.1.104', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d371c1b9-7f76-4858-b510-8aaef172461d', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'psp_authorization', true, '2025-11-19 03:02:12.931062+00', '192.168.1.104', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d547bf91-b0e8-49ad-85c8-3ff0dc5bc250', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'applicant_certification', true, '2025-11-09 03:02:12.931062+00', '192.168.1.105', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('6341be25-525e-49b0-9a89-9bbc0256484e', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'fmcsa_clearinghouse', true, '2025-11-09 03:02:12.931062+00', '192.168.1.105', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('063d2547-5026-422b-904d-59dd317b10ae', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'hireright_background', true, '2025-11-09 03:02:12.931062+00', '192.168.1.105', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('db43ad7b-3885-47c5-85e2-2dca88231da0', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'psp_authorization', true, '2025-11-09 03:02:12.931062+00', '192.168.1.105', 'Mozilla/5.0', '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00');


--
-- Data for Name: background_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."background_questions" ("id", "user_id", "question_number", "answer", "explanation", "created_at", "updated_at") VALUES
	('e76b6ffb-c575-43c2-a53f-b733f5858468', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 1, false, NULL, '2025-12-14 04:06:49.331221+00', '2025-12-14 04:06:49.327+00'),
	('b7fcf464-3784-421d-b220-114d33802026', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 3, false, NULL, '2025-12-14 04:06:49.331351+00', '2025-12-14 04:06:49.327+00'),
	('f97a96a5-5aed-44f4-8da7-7b899110b98b', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 5, false, NULL, '2025-12-14 04:06:49.331741+00', '2025-12-14 04:06:49.327+00'),
	('d5dca9f4-7559-4123-89d9-317e99b3e5f8', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 7, false, NULL, '2025-12-14 04:06:49.339179+00', '2025-12-14 04:06:49.327+00'),
	('12bb2ff0-ae70-4b33-a3d7-5ec2dd2fc024', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 9, false, NULL, '2025-12-14 04:06:49.339551+00', '2025-12-14 04:06:49.327+00'),
	('a140ca60-6e14-4dfd-a619-b3d8e1471744', '8406cf66-046d-452d-800c-a6d7a914579f', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f7770eda-7e7e-4d95-82eb-a7ef8b59653e', '8406cf66-046d-452d-800c-a6d7a914579f', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b47e381d-3e02-4cb3-a83d-1bcf51cc8b95', '8406cf66-046d-452d-800c-a6d7a914579f', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('746ddef4-aaa8-46e6-aa26-9b75e11e9a4e', '8406cf66-046d-452d-800c-a6d7a914579f', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('5ac66144-1f29-4f69-babe-5dbcb1140c8f', '8406cf66-046d-452d-800c-a6d7a914579f', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f4d9492f-7275-4450-8693-97483b67c66b', '8406cf66-046d-452d-800c-a6d7a914579f', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('5aaa3f0d-23af-4969-812d-6def325135ab', '8406cf66-046d-452d-800c-a6d7a914579f', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('29099479-e438-4178-b11c-c723aa5877dc', '8406cf66-046d-452d-800c-a6d7a914579f', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e8f448c3-3613-4d32-8fed-87721efda67e', '8406cf66-046d-452d-800c-a6d7a914579f', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('0612e30e-621f-4c45-afdb-486ebed96686', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e4ed093e-f517-4039-b02e-54e5342d3a11', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('9f2702fe-8cf4-47f6-97c6-d2d8683696d5', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('865b22e1-de00-46e8-92a0-9d8be4fa6926', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('97a833e0-01fb-4dce-a134-dcf3d61f146a', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('47c27cfa-3493-4630-84ec-13325a801c15', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('43b5e123-3e87-4804-8a50-aa511a534f2d', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('e901c331-034c-463b-90b9-9e17d9208c47', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('8dbec9d9-4075-4ffd-a62b-94e7a4ebf43f', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('4a04c46c-2fe0-4c19-a819-78e04332e75d', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('3453e193-47c2-4d4d-8ce8-08a7de0c9f21', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('264155f5-5522-495e-adfd-ebbb5a652191', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('586d2040-32da-447b-a458-fd4135c55ce9', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('1353cbcf-1f9b-46b2-8b6a-ba90060bed95', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('075793f7-6113-4d34-9493-32222273f125', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('62473a35-33fe-45c2-b6e4-9b907441a7ce', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d9c53e93-4615-4cd9-83cd-abde181426c8', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('52796e91-4c32-4506-a54b-a591b1a2eaf1', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('83041d40-402d-4bce-ac22-a66de8c704f2', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('7baa2a77-d58c-42b2-9159-1a9f6357a0a6', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('fefd248a-e4b6-4a73-af32-758e3189e7fd', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('669a07e1-d82e-4790-aff2-d0eda812489b', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b3534ac5-d876-4a82-b676-93c72c1c5486', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('58e79187-827d-4a0f-ac0b-417eafae226a', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('244774f8-a7eb-4e4d-98b7-c56cb6a00fe4', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('c6122ab7-bdff-463e-ace4-b8701423d1ab', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('7568a566-d668-4b20-9d2f-60dd47e73b45', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('84037394-f604-4938-8d27-449fc6886b09', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f1bab8a0-5d6c-4aff-af2d-eed6e57d8f9f', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d2c8fd0f-e2e9-485d-8beb-bec7e42ed8e6', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('edf07886-8abe-4dd1-bdb3-69bf46a79408', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('6749e74d-1337-4570-afc8-334e35db1c20', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d284f941-1443-484f-9552-d22083bc51d4', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('82a5eced-f99d-44dc-957d-8f6fdb5f7b2b', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('1ad9895b-45cc-4291-85e5-bccec72b7242', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('caf4a48d-b117-4a36-8288-f117ef2a9aa3', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('5b193a64-b998-401f-a1a2-dc3f27f54666', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('9afd9e8b-0999-4764-8b1f-e29afca2de4a', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('c7b58aff-4e1f-487b-8e5a-5c076d61f3a3', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('bbf7907a-46e2-4c59-bbae-0099d753457e', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 4, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('1be635bd-8f6c-4e16-9e36-3831fbdebb21', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 5, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('ac556b9b-d114-43a8-9bed-8a27ab1ed291', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 6, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('88ee3009-b928-488f-805d-6360fbb8a641', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 7, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('3a95ac8d-a42a-49fb-9f70-5400f578deae', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 8, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('1d32612a-4ff5-4d13-898d-01f611ac4fcd', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 9, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('2cf7d8b7-4da2-4578-bdc0-0f76fc93763f', '81d919d7-f558-4d84-bced-e9659828c08e', 1, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('24e554fb-3086-409d-a302-cc85f711c5b1', '81d919d7-f558-4d84-bced-e9659828c08e', 2, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f4ce6f11-f302-47a9-b7c7-01babab8ec0f', '81d919d7-f558-4d84-bced-e9659828c08e', 3, false, NULL, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('55525712-c82d-46f8-845a-2ce61fe161fb', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 2, false, NULL, '2025-12-14 04:06:49.33147+00', '2025-12-14 04:06:49.327+00'),
	('53869c81-96a7-4bab-a10d-e5abe20e0092', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 6, false, NULL, '2025-12-14 04:06:49.332302+00', '2025-12-14 04:06:49.327+00'),
	('dd88e0a1-5cde-4bc4-b848-6fad43b53775', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 4, false, NULL, '2025-12-14 04:06:49.331384+00', '2025-12-14 04:06:49.327+00'),
	('e9b0489f-8991-4921-b293-ac4f20b22f25', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 8, false, NULL, '2025-12-14 04:06:49.339542+00', '2025-12-14 04:06:49.327+00');


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."documents" ("id", "user_id", "document_type", "file_name", "file_path", "file_size", "mime_type", "uploaded_at", "created_at") VALUES
	('85840fc5-9d6c-4a24-a763-1e401c4b1225', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'resume', 'mama-joe.pdf', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/1765684224335.pdf', 2624, 'application/pdf', '2025-12-14 03:50:24.425205+00', '2025-12-14 03:50:24.425205+00'),
	('f16d2d72-e6e3-4509-85a2-0cff3a87ade0', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'resume', 'mama-joe.pdf', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad/1765685227030.pdf', 2624, 'application/pdf', '2025-12-14 04:07:07.109518+00', '2025-12-14 04:07:07.109518+00');


--
-- Data for Name: emergency_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."emergency_contacts" ("id", "user_id", "full_name", "address_street", "address_city", "address_state", "address_zip", "relationship", "phone", "order", "created_at", "updated_at") VALUES
	('249cf708-3e1f-4a82-b008-082c8a90e8e2', '8406cf66-046d-452d-800c-a6d7a914579f', 'John Johnson', '456 Oak Ave', 'Chicago', 'IL', '60601', 'Spouse', '555-0203', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('74e60139-4c09-4b4a-b58e-611b688897ef', '8406cf66-046d-452d-800c-a6d7a914579f', 'Jane Johnson', '456 Oak Ave', 'Chicago', 'IL', '60601', 'Mother', '555-0204', 1, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('d95400f0-14b5-428f-b1fa-10cbd244ffec', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Sarah Williams', '789 Elm St', 'Peoria', 'IL', '61601', 'Spouse', '555-0304', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('03112932-5094-4adb-9d2f-cac7270b03b8', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'Mike Brown', '321 Pine Rd', 'Rockford', 'IL', '61101', 'Father', '555-0405', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('997b6172-ba02-4624-948e-81071f1c6dd7', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'Lisa Davis', '654 Maple Dr', 'Naperville', 'IL', '60540', 'Spouse', '555-0506', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('83fae8d8-3d03-4ee0-baec-60ade944e74c', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'Tom Miller', '987 Cedar Ln', 'Aurora', 'IL', '60502', 'Brother', '555-0607', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('afd8b40f-55ac-4ad0-b51c-d59e862a427b', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'Amy Wilson', '147 Birch Way', 'Joliet', 'IL', '60431', 'Sister', '555-0708', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('73d33cc0-19f3-4973-895c-03282998ad54', '81d919d7-f558-4d84-bced-e9659828c08e', 'Mary Smith', '123 Main St', 'Springfield', 'IL', '62701', 'Spouse', '555-0102', 0, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('71e583ec-0b94-4be1-aae8-44c6e4a5ea26', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'Jane Do', '400 San Jacinto', 'Dallas', 'Texas', '75234', 'Mama', '2147891044', 0, '2025-12-14 04:06:58.035754+00', '2025-12-14 04:06:58.035754+00');


--
-- Data for Name: employment_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employment_history" ("id", "user_id", "company_name", "company_address_street", "company_address_city", "company_address_state", "company_address_zip", "supervisor_name", "supervisor_phone", "supervisor_email", "start_date", "end_date", "reason_for_leaving", "cdl_required", "is_cdl_employment", "created_at", "updated_at") VALUES
	('04ff38f0-66c7-4851-a33c-7814028e2cfe', '8406cf66-046d-452d-800c-a6d7a914579f', 'ABC Logistics', '100 Truck Way', 'Chicago', 'IL', '60601', 'John Supervisor', '555-1000', 'john@abclog.com', '2020-03-01', '2022-12-31', 'Better opportunity', true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b2696cc9-a255-4c4c-838f-4c60e65ca27f', '8406cf66-046d-452d-800c-a6d7a914579f', 'XYZ Transport', '200 Highway Dr', 'Chicago', 'IL', '60602', 'Jane Manager', '555-2000', 'jane@xyztran.com', '2023-01-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('a489f40d-ed3c-4514-b510-ed109fdf7298', '8406cf66-046d-452d-800c-a6d7a914579f', 'Part-time Retail', '300 Mall Blvd', 'Chicago', 'IL', '60603', 'Bob Boss', '555-3000', 'bob@retail.com', '2018-01-01', '2020-02-28', 'Started trucking career', false, false, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f54bb5ce-abe1-4bcb-9771-742133986195', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Fast Freight Inc', '400 Trucking Ave', 'Peoria', 'IL', '61601', 'Mike Lead', '555-4000', 'mike@fastfreight.com', '2019-07-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('f661269b-dbc3-4311-953e-320bd82c73ab', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Previous CDL Job', '500 Road St', 'Peoria', 'IL', '61602', 'Sarah Manager', '555-5000', 'sarah@previous.com', '2016-01-01', '2019-06-30', 'Company closed', true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('7fd1ab14-2077-4ccb-9a80-c62ae1f8dda8', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'Swift Delivery', '700 Fast Ln', 'Naperville', 'IL', '60540', 'Lisa Manager', '555-7000', 'lisa@swift.com', '2019-02-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('3ee13576-e5bf-403b-bb08-ff8b41df8af4', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'Quick Logistics', '800 Speed Rd', 'Aurora', 'IL', '60502', 'Dave Lead', '555-8000', 'dave@quick.com', '2020-08-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('b2a34e06-9ccb-4489-920c-ccc5c26ef737', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'Efficient Movers', '900 Route Ave', 'Joliet', 'IL', '60431', 'Amy Supervisor', '555-9000', 'amy@efficient.com', '2020-04-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('0fff0e30-fbe5-4c01-a7fb-6c621121b16f', '81d919d7-f558-4d84-bced-e9659828c08e', 'Current Job', '100 Work St', 'Springfield', 'IL', '62701', 'Current Boss', '555-9999', 'boss@current.com', '2023-06-01', NULL, NULL, true, false, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:02:12.931062+00'),
	('0fdf05a1-30a1-4625-ac12-31a75b900a2b', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'Reliable Transport', '600 Drive Way', 'Rockford', 'IL', '61101', 'Tom Supervisor', '555-6000', 'tom@reliable.com', '2020-11-01', NULL, NULL, true, true, '2025-12-14 03:02:12.931062+00', '2025-12-14 03:55:01.703+00'),
	('043f1d23-06c7-474a-9628-249f49deb39d', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'Reliable Transport', '600 Drive Way', 'Rockford', 'IL', '61101', 'Tom Supervisor', '555-6000', 'tom@reliable.com', '2025-12-02', '2025-12-02', '', true, true, '2025-12-14 04:04:53.634595+00', '2025-12-14 04:04:53.634595+00'),
	('72c9fc7a-dd2d-40b3-ab46-5734a71b81d3', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'Five Co Inc.', '2727 Lyndon B Johnson Fwy Ste 785', 'Dallas', 'Texas', '75234', '', '4696842955', 'john@status26.com', '2010-12-01', '2022-06-08', '', true, true, '2025-12-14 04:05:26.643061+00', '2025-12-14 04:05:26.643061+00'),
	('378566c9-8ed0-4b00-ac98-c845b88ffc03', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'Status26 Inc.', '2727 Lyndon B Johnson Fwy Ste 785', 'Dallas', 'Texas', '75234', NULL, '4696842955', 'john@status26.com', '2022-12-06', '2025-09-01', 'New career', false, false, '2025-12-14 04:03:59.008116+00', '2025-12-14 04:14:01.43+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "user_id", "full_name", "email", "phone", "created_at", "updated_at", "ssn", "date_of_birth", "present_address_street", "present_address_city", "present_address_state", "present_address_zip", "cdl_number", "cdl_state", "cdl_expiration_date", "driving_experience_years", "driving_experience_miles", "driving_experience_equipment", "profile_completed_at") VALUES
	('df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'John Manager', 'john@status26.com', NULL, '2025-12-14 03:00:14.823832+00', '2025-12-14 03:00:14.823832+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'Alice Driver', 'alice@hands.test', NULL, '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('81d919d7-f558-4d84-bced-e9659828c08e', '81d919d7-f558-4d84-bced-e9659828c08e', 'Bob Smith', 'bob@hands.test', '555-0101', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '123-45-6789', '1985-06-15', '123 Main St', 'Springfield', 'IL', '62701', 'CDL123456', 'IL', NULL, NULL, NULL, NULL, NULL),
	('8406cf66-046d-452d-800c-a6d7a914579f', '8406cf66-046d-452d-800c-a6d7a914579f', 'Carol Johnson', 'carol@hands.test', '555-0202', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '234-56-7890', '1990-03-20', '456 Oak Ave', 'Chicago', 'IL', '60601', 'CDL234567', 'IL', '2026-12-31', NULL, NULL, NULL, '2025-11-14 03:02:12.931062+00'),
	('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'David Williams', 'david@hands.test', '555-0303', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '345-67-8901', '1988-07-10', '789 Elm St', 'Peoria', 'IL', '61601', 'CDL345678', 'IL', '2027-06-30', NULL, NULL, NULL, '2025-10-30 03:02:12.931062+00'),
	('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'Emily Brown', 'emily@hands.test', '555-0404', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '456-78-9012', '1992-11-25', '321 Pine Rd', 'Rockford', 'IL', '61101', 'CDL456789', 'IL', '2028-03-15', NULL, NULL, NULL, '2025-11-24 03:02:12.931062+00'),
	('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'Frank Davis', 'frank@hands.test', '555-0505', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '567-89-0123', '1987-02-14', '654 Maple Dr', 'Naperville', 'IL', '60540', 'CDL567890', 'IL', '2027-09-30', NULL, NULL, NULL, '2025-10-15 03:02:12.931062+00'),
	('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'Grace Miller', 'grace@hands.test', '555-0606', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '678-90-1234', '1991-08-05', '987 Cedar Ln', 'Aurora', 'IL', '60502', 'CDL678901', 'IL', '2026-11-20', NULL, NULL, NULL, '2025-11-19 03:02:12.931062+00'),
	('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'Henry Wilson', 'henry@hands.test', '555-0707', '2025-12-14 03:00:14.823832+00', '2025-12-14 03:02:12.931062+00', '789-01-2345', '1989-04-18', '147 Birch Way', 'Joliet', 'IL', '60431', 'CDL789012', 'IL', '2028-01-15', NULL, NULL, NULL, '2025-11-09 03:02:12.931062+00'),
	('2ca4788b-cfe5-431d-9979-5fa8dd68bdad', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'Mama Joe', 'jwogrady@me.com', ' (214) 749-5600', '2025-12-14 03:12:00.219358+00', '2025-12-14 04:13:49.53+00', '1212124222', '1979-12-04', '12123 North Colfax', 'Plano', 'Texas', '75075', '1234', 'texas', '2036-12-23', NULL, NULL, NULL, NULL);


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('9722dbf7-8eb7-484e-92bf-3e7a1a84abf3', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('fa3ab4e3-4fed-4971-882d-efd49bc1907c', '81d919d7-f558-4d84-bced-e9659828c08e', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('94ff43e8-4298-45a5-8ff5-d4c237a63a57', '8406cf66-046d-452d-800c-a6d7a914579f', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('9931b2a8-c9ff-4017-8f2d-ed6a0c189a9a', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('4b2e4eb3-b81f-44e9-9dfc-301a2402de89', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('f2489ec4-24e0-4e25-8fc9-39ba1cc004b3', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('3b249920-3282-4648-8d33-c7331efd88fb', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('38dec35f-8403-40c6-9661-f1e058753e83', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'candidate', '2025-12-14 03:00:14.823832+00'),
	('e6f9c80c-b433-4dbe-9d8c-7b517a980c7e', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'manager', '2025-12-14 03:00:47.316394+00'),
	('3ec2985c-e0de-40e5-b132-6c9c89aa8aed', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', 'candidate', '2025-12-14 03:12:00.219358+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('documents', 'documents', NULL, '2025-12-14 02:49:05.28886+00', '2025-12-14 02:49:05.28886+00', false, false, 52428800, '{application/pdf,image/jpeg,image/png,image/jpg}', NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
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

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('e25558c7-b470-4f12-8bf3-608e3cdd4b10', 'documents', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d/1765684224335.pdf', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '2025-12-14 03:50:24.409192+00', '2025-12-14 03:50:24.409192+00', '2025-12-14 03:50:24.409192+00', '{"eTag": "\"77747b28e21f2b7f61341bce20e9b814\"", "size": 2624, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-12-14T03:50:24.402Z", "contentLength": 2624, "httpStatusCode": 200}', 'a15653bc-1d17-4a40-94a7-34609e667bbf', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '{}', 2),
	('41c64e46-4fdb-49e2-ae4f-1930be9cc0d3', 'documents', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad/1765685227030.pdf', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', '2025-12-14 04:07:07.098238+00', '2025-12-14 04:07:07.098238+00', '2025-12-14 04:07:07.098238+00', '{"eTag": "\"77747b28e21f2b7f61341bce20e9b814\"", "size": 2624, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-12-14T04:07:07.091Z", "contentLength": 2624, "httpStatusCode": 200}', 'cbe11854-0721-46f3-826e-5f75a9c93fe1', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', '{}', 2);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") VALUES
	('documents', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '2025-12-14 03:50:24.409192+00', '2025-12-14 03:50:24.409192+00'),
	('documents', '2ca4788b-cfe5-431d-9979-5fa8dd68bdad', '2025-12-14 04:07:07.098238+00', '2025-12-14 04:07:07.098238+00');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 59, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict iaGkJDKenLlfGIps6hjBWjtOT2peVQ0v5Jrg4dbVvX3HGmca8OkrCfSAcrapCs5

RESET ALL;
-- End of public schema data
