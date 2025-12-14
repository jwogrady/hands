-- Complete Seed Data for Hands Application
-- This creates comprehensive test data with applicants in various stages
-- Password for all users: "password123"
-- Run create-test-users.sql FIRST to create auth.users entries

BEGIN;

-- ============================================================================
-- CONSTANTS: User IDs
-- ============================================================================
-- Manager: df0e04a4-4b3c-4666-9a68-a78f1d67f15f (john@status26.com)
-- Candidate 1 (NOT STARTED): bfe9d5cd-8eca-4c82-83ee-dc0689844750 (alice@hands.test)
-- Candidate 2 (PARTIAL): 81d919d7-f558-4d84-bced-e9659828c08e (bob@hands.test)
-- Candidate 3 (COMPLETE, NO APP): 8406cf66-046d-452d-800c-a6d7a914579f (carol@hands.test)
-- Candidate 4 (COMPLETE, SUBMITTED): 3382f5ee-1a5c-4e8c-a99c-fc22acdf0216 (david@hands.test)
-- Candidate 5 (COMPLETE, UNDER REVIEW): 7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d (emily@hands.test)
-- Candidate 6 (COMPLETE, APPROVED): 8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e (frank@hands.test)
-- Candidate 7 (COMPLETE, REJECTED): 9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f (grace@hands.test)
-- Candidate 8 (COMPLETE, MORE INFO): 0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a (henry@hands.test)

-- ============================================================================
-- CLEANUP: Remove existing seed data
-- ============================================================================
DELETE FROM application_answers WHERE application_id IN (
  '11111111-1111-4111-a111-111111111111',
  '22222222-2222-4222-a222-222222222222',
  '33333333-3333-4333-a333-333333333333',
  '44444444-4444-4444-a444-444444444444',
  '55555555-5555-4555-a555-555555555555'
);

DELETE FROM applications WHERE id IN (
  '11111111-1111-4111-a111-111111111111',
  '22222222-2222-4222-a222-222222222222',
  '33333333-3333-4333-a333-333333333333',
  '44444444-4444-4444-a444-444444444444',
  '55555555-5555-4555-a555-555555555555'
);

DELETE FROM application_answers WHERE application_id IN (
  SELECT id FROM applications WHERE candidate_id IN (
    'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
    '81d919d7-f558-4d84-bced-e9659828c08e',
    '8406cf66-046d-452d-800c-a6d7a914579f',
    '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
    '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
    '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
    '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
    '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
  )
);

DELETE FROM applications WHERE candidate_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM authorizations WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM documents WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM emergency_contacts WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM background_questions WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM employment_history WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM address_history WHERE user_id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
);

DELETE FROM job_questions WHERE job_id IN (
  SELECT id FROM jobs WHERE created_by = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f'
);

DELETE FROM jobs WHERE created_by = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f';

-- ============================================================================
-- USER ROLES: Ensure manager role for john@status26.com
-- ============================================================================
-- First, remove candidate role from manager if it exists (managers shouldn't be candidates)
-- The trigger automatically creates a candidate role, so we need to remove it for managers
DELETE FROM user_roles 
WHERE user_id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' 
AND role = 'candidate';

-- Then add manager role
INSERT INTO user_roles (user_id, role)
VALUES ('df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'manager')
ON CONFLICT (user_id, role) DO NOTHING;

-- Candidate roles are created by trigger, but ensure they exist for all candidates
-- Exclude the manager user from candidate role assignment
INSERT INTO user_roles (user_id, role)
SELECT id, 'candidate' FROM auth.users 
WHERE id IN (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216',
  '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
  '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
  '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
  '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a'
)
AND id != 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' -- Exclude manager
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- PROFILES: Update profile data for each candidate
-- ============================================================================

-- 1. NOT STARTED - Alice (alice@hands.test)
UPDATE profiles SET
  full_name = 'Alice Driver',
  email = 'alice@hands.test',
  phone = NULL,
  ssn = NULL,
  date_of_birth = NULL,
  present_address_street = NULL,
  present_address_city = NULL,
  present_address_state = NULL,
  present_address_zip = NULL,
  cdl_number = NULL,
  cdl_state = NULL,
  cdl_expiration_date = NULL,
  profile_completed_at = NULL,
  updated_at = NOW()
WHERE user_id = 'bfe9d5cd-8eca-4c82-83ee-dc0689844750';

-- 2. PARTIAL - Bob (bob@hands.test)
UPDATE profiles SET
  full_name = 'Bob Smith',
  email = 'bob@hands.test',
  phone = '555-0101',
  ssn = '123-45-6789',
  date_of_birth = '1985-06-15',
  present_address_street = '123 Main St',
  present_address_city = 'Springfield',
  present_address_state = 'IL',
  present_address_zip = '62701',
  cdl_number = 'CDL123456',
  cdl_state = 'IL',
  cdl_expiration_date = NULL, -- Missing expiration
  profile_completed_at = NULL,
  updated_at = NOW()
WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

-- 3-8. COMPLETE profiles (Carol, David, Emily, Frank, Grace, Henry)
-- Carol - Complete, no application
UPDATE profiles SET
  full_name = 'Carol Johnson',
  email = 'carol@hands.test',
  phone = '555-0202',
  ssn = '234-56-7890',
  date_of_birth = '1990-03-20',
  present_address_street = '456 Oak Ave',
  present_address_city = 'Chicago',
  present_address_state = 'IL',
  present_address_zip = '60601',
  cdl_number = 'CDL234567',
  cdl_state = 'IL',
  cdl_expiration_date = '2026-12-31',
  profile_completed_at = NOW() - INTERVAL '30 days',
  updated_at = NOW()
WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

-- David - Complete, submitted application
UPDATE profiles SET
  full_name = 'David Williams',
  email = 'david@hands.test',
  phone = '555-0303',
  ssn = '345-67-8901',
  date_of_birth = '1988-07-10',
  present_address_street = '789 Elm St',
  present_address_city = 'Peoria',
  present_address_state = 'IL',
  present_address_zip = '61601',
  cdl_number = 'CDL345678',
  cdl_state = 'IL',
  cdl_expiration_date = '2027-06-30',
  profile_completed_at = NOW() - INTERVAL '45 days',
  updated_at = NOW()
WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

-- Emily - Complete, under review
UPDATE profiles SET
  full_name = 'Emily Brown',
  email = 'emily@hands.test',
  phone = '555-0404',
  ssn = '456-78-9012',
  date_of_birth = '1992-11-25',
  present_address_street = '321 Pine Rd',
  present_address_city = 'Rockford',
  present_address_state = 'IL',
  present_address_zip = '61101',
  cdl_number = 'CDL456789',
  cdl_state = 'IL',
  cdl_expiration_date = '2028-03-15',
  profile_completed_at = NOW() - INTERVAL '20 days',
  updated_at = NOW()
WHERE user_id = '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d';

-- Frank - Complete, approved
UPDATE profiles SET
  full_name = 'Frank Davis',
  email = 'frank@hands.test',
  phone = '555-0505',
  ssn = '567-89-0123',
  date_of_birth = '1987-02-14',
  present_address_street = '654 Maple Dr',
  present_address_city = 'Naperville',
  present_address_state = 'IL',
  present_address_zip = '60540',
  cdl_number = 'CDL567890',
  cdl_state = 'IL',
  cdl_expiration_date = '2027-09-30',
  profile_completed_at = NOW() - INTERVAL '60 days',
  updated_at = NOW()
WHERE user_id = '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e';

-- Grace - Complete, rejected
UPDATE profiles SET
  full_name = 'Grace Miller',
  email = 'grace@hands.test',
  phone = '555-0606',
  ssn = '678-90-1234',
  date_of_birth = '1991-08-05',
  present_address_street = '987 Cedar Ln',
  present_address_city = 'Aurora',
  present_address_state = 'IL',
  present_address_zip = '60502',
  cdl_number = 'CDL678901',
  cdl_state = 'IL',
  cdl_expiration_date = '2026-11-20',
  profile_completed_at = NOW() - INTERVAL '25 days',
  updated_at = NOW()
WHERE user_id = '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f';

-- Henry - Complete, more info requested
UPDATE profiles SET
  full_name = 'Henry Wilson',
  email = 'henry@hands.test',
  phone = '555-0707',
  ssn = '789-01-2345',
  date_of_birth = '1989-04-18',
  present_address_street = '147 Birch Way',
  present_address_city = 'Joliet',
  present_address_state = 'IL',
  present_address_zip = '60431',
  cdl_number = 'CDL789012',
  cdl_state = 'IL',
  cdl_expiration_date = '2028-01-15',
  profile_completed_at = NOW() - INTERVAL '35 days',
  updated_at = NOW()
WHERE user_id = '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a';

-- ============================================================================
-- ADDRESS HISTORY: Complete profiles need 3+ years of history
-- ============================================================================

-- Carol's address history (3+ years)
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('8406cf66-046d-452d-800c-a6d7a914579f', '456 Oak Ave', 'Chicago', 'IL', '60601', '2021-03-01', NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', '789 Previous St', 'Chicago', 'IL', '60602', '2019-03-01', '2021-02-28')
ON CONFLICT DO NOTHING;

-- David's address history
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '789 Elm St', 'Peoria', 'IL', '61601', '2020-07-01', NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '321 Old Ave', 'Peoria', 'IL', '61602', '2018-07-01', '2020-06-30')
ON CONFLICT DO NOTHING;

-- Emily's address history
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', '321 Pine Rd', 'Rockford', 'IL', '61101', '2020-11-01', NULL)
ON CONFLICT DO NOTHING;

-- Frank's address history
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', '654 Maple Dr', 'Naperville', 'IL', '60540', '2019-02-01', NULL)
ON CONFLICT DO NOTHING;

-- Grace's address history
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', '987 Cedar Ln', 'Aurora', 'IL', '60502', '2020-08-01', NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', '654 Past St', 'Aurora', 'IL', '60503', '2018-08-01', '2020-07-31')
ON CONFLICT DO NOTHING;

-- Henry's address history
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', '147 Birch Way', 'Joliet', 'IL', '60431', '2020-04-01', NULL)
ON CONFLICT DO NOTHING;

-- Bob's partial address history (less than 3 years)
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
  ('81d919d7-f558-4d84-bced-e9659828c08e', '123 Main St', 'Springfield', 'IL', '62701', '2023-06-01', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- EMPLOYMENT HISTORY: Regular and CDL employment
-- ============================================================================

-- Carol - Complete employment history
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'ABC Logistics', '100 Truck Way', 'Chicago', 'IL', '60601', 'John Supervisor', '555-1000', 'john@abclog.com', '2020-03-01', '2022-12-31', 'Better opportunity', true, true),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'XYZ Transport', '200 Highway Dr', 'Chicago', 'IL', '60602', 'Jane Manager', '555-2000', 'jane@xyztran.com', '2023-01-01', NULL, NULL, true, true),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'Part-time Retail', '300 Mall Blvd', 'Chicago', 'IL', '60603', 'Bob Boss', '555-3000', 'bob@retail.com', '2018-01-01', '2020-02-28', 'Started trucking career', false, false)
ON CONFLICT DO NOTHING;

-- David - Complete employment history
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Fast Freight Inc', '400 Trucking Ave', 'Peoria', 'IL', '61601', 'Mike Lead', '555-4000', 'mike@fastfreight.com', '2019-07-01', NULL, NULL, true, true),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Previous CDL Job', '500 Road St', 'Peoria', 'IL', '61602', 'Sarah Manager', '555-5000', 'sarah@previous.com', '2016-01-01', '2019-06-30', 'Company closed', true, true)
ON CONFLICT DO NOTHING;

-- Emily, Frank, Grace, Henry - Similar complete employment history
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'Reliable Transport', '600 Drive Way', 'Rockford', 'IL', '61101', 'Tom Supervisor', '555-6000', 'tom@reliable.com', '2020-11-01', NULL, NULL, true, true),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'Swift Delivery', '700 Fast Ln', 'Naperville', 'IL', '60540', 'Lisa Manager', '555-7000', 'lisa@swift.com', '2019-02-01', NULL, NULL, true, true),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'Quick Logistics', '800 Speed Rd', 'Aurora', 'IL', '60502', 'Dave Lead', '555-8000', 'dave@quick.com', '2020-08-01', NULL, NULL, true, true),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'Efficient Movers', '900 Route Ave', 'Joliet', 'IL', '60431', 'Amy Supervisor', '555-9000', 'amy@efficient.com', '2020-04-01', NULL, NULL, true, true)
ON CONFLICT DO NOTHING;

-- Bob - Partial employment (only 1 entry)
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
  ('81d919d7-f558-4d84-bced-e9659828c08e', 'Current Job', '100 Work St', 'Springfield', 'IL', '62701', 'Current Boss', '555-9999', 'boss@current.com', '2023-06-01', NULL, NULL, true, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- BACKGROUND QUESTIONS: All questions answered for complete profiles
-- ============================================================================

-- Complete profiles (Carol, David, Emily, Frank, Grace, Henry) - All 9 questions answered
INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
  -- Carol
  ('8406cf66-046d-452d-800c-a6d7a914579f', 1, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 2, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 3, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 4, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 5, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 6, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 7, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 8, false, NULL),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 9, false, NULL),
  -- David
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 1, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 2, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 3, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 4, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 5, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 6, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 7, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 8, false, NULL),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 9, false, NULL),
  -- Emily
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 1, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 2, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 3, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 4, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 5, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 6, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 7, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 8, false, NULL),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 9, false, NULL),
  -- Frank
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 1, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 2, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 3, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 4, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 5, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 6, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 7, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 8, false, NULL),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 9, false, NULL),
  -- Grace
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 1, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 2, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 3, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 4, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 5, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 6, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 7, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 8, false, NULL),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 9, false, NULL),
  -- Henry
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 1, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 2, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 3, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 4, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 5, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 6, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 7, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 8, false, NULL),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 9, false, NULL)
ON CONFLICT (user_id, question_number) DO NOTHING;

-- Bob - Partial (only 3 questions answered)
INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
  ('81d919d7-f558-4d84-bced-e9659828c08e', 1, false, NULL),
  ('81d919d7-f558-4d84-bced-e9659828c08e', 2, false, NULL),
  ('81d919d7-f558-4d84-bced-e9659828c08e', 3, false, NULL)
ON CONFLICT (user_id, question_number) DO NOTHING;

-- ============================================================================
-- EMERGENCY CONTACTS: At least 1 for complete profiles
-- ============================================================================

INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
  -- Carol
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'John Johnson', '456 Oak Ave', 'Chicago', 'IL', '60601', 'Spouse', '555-0203', 0),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'Jane Johnson', '456 Oak Ave', 'Chicago', 'IL', '60601', 'Mother', '555-0204', 1),
  -- David
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Sarah Williams', '789 Elm St', 'Peoria', 'IL', '61601', 'Spouse', '555-0304', 0),
  -- Emily
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'Mike Brown', '321 Pine Rd', 'Rockford', 'IL', '61101', 'Father', '555-0405', 0),
  -- Frank
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'Lisa Davis', '654 Maple Dr', 'Naperville', 'IL', '60540', 'Spouse', '555-0506', 0),
  -- Grace
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'Tom Miller', '987 Cedar Ln', 'Aurora', 'IL', '60502', 'Brother', '555-0607', 0),
  -- Henry
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'Amy Wilson', '147 Birch Way', 'Joliet', 'IL', '60431', 'Sister', '555-0708', 0),
  -- Bob - Partial (1 contact)
  ('81d919d7-f558-4d84-bced-e9659828c08e', 'Mary Smith', '123 Main St', 'Springfield', 'IL', '62701', 'Spouse', '555-0102', 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- AUTHORIZATIONS: All 4 required for complete profiles
-- ============================================================================

INSERT INTO authorizations (user_id, authorization_type, signed, signed_at, ip_address, user_agent)
VALUES
  -- Carol
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'applicant_certification', true, NOW() - INTERVAL '30 days', '192.168.1.100', 'Mozilla/5.0'),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '30 days', '192.168.1.100', 'Mozilla/5.0'),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'hireright_background', true, NOW() - INTERVAL '30 days', '192.168.1.100', 'Mozilla/5.0'),
  ('8406cf66-046d-452d-800c-a6d7a914579f', 'psp_authorization', true, NOW() - INTERVAL '30 days', '192.168.1.100', 'Mozilla/5.0'),
  -- David
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'applicant_certification', true, NOW() - INTERVAL '45 days', '192.168.1.101', 'Mozilla/5.0'),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '45 days', '192.168.1.101', 'Mozilla/5.0'),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'hireright_background', true, NOW() - INTERVAL '45 days', '192.168.1.101', 'Mozilla/5.0'),
  ('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'psp_authorization', true, NOW() - INTERVAL '45 days', '192.168.1.101', 'Mozilla/5.0'),
  -- Emily
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'applicant_certification', true, NOW() - INTERVAL '20 days', '192.168.1.102', 'Mozilla/5.0'),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '20 days', '192.168.1.102', 'Mozilla/5.0'),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'hireright_background', true, NOW() - INTERVAL '20 days', '192.168.1.102', 'Mozilla/5.0'),
  ('7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d', 'psp_authorization', true, NOW() - INTERVAL '20 days', '192.168.1.102', 'Mozilla/5.0'),
  -- Frank
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'applicant_certification', true, NOW() - INTERVAL '60 days', '192.168.1.103', 'Mozilla/5.0'),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '60 days', '192.168.1.103', 'Mozilla/5.0'),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'hireright_background', true, NOW() - INTERVAL '60 days', '192.168.1.103', 'Mozilla/5.0'),
  ('8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e', 'psp_authorization', true, NOW() - INTERVAL '60 days', '192.168.1.103', 'Mozilla/5.0'),
  -- Grace
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'applicant_certification', true, NOW() - INTERVAL '25 days', '192.168.1.104', 'Mozilla/5.0'),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '25 days', '192.168.1.104', 'Mozilla/5.0'),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'hireright_background', true, NOW() - INTERVAL '25 days', '192.168.1.104', 'Mozilla/5.0'),
  ('9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f', 'psp_authorization', true, NOW() - INTERVAL '25 days', '192.168.1.104', 'Mozilla/5.0'),
  -- Henry
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'applicant_certification', true, NOW() - INTERVAL '35 days', '192.168.1.105', 'Mozilla/5.0'),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '35 days', '192.168.1.105', 'Mozilla/5.0'),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'hireright_background', true, NOW() - INTERVAL '35 days', '192.168.1.105', 'Mozilla/5.0'),
  ('0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a', 'psp_authorization', true, NOW() - INTERVAL '35 days', '192.168.1.105', 'Mozilla/5.0')
ON CONFLICT (user_id, authorization_type) DO NOTHING;

-- ============================================================================
-- JOBS: Create test job postings
-- ============================================================================

INSERT INTO jobs (id, title, description, requirements, created_by, is_active, created_at)
VALUES
  ('a1b2c3d4-e5f6-4789-a012-345678901234', 'CDL Class A Driver', 
   'We are seeking an experienced CDL Class A driver for long-haul routes. Must have 2+ years experience and clean driving record.',
   'CDL Class A license, 2+ years experience, Clean driving record, DOT physical',
   'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true, NOW() - INTERVAL '90 days'),
  ('b2c3d4e5-f6a7-4890-b123-456789012345', 'Local Delivery Driver',
   'Local delivery driver position with flexible hours. Great for drivers looking for home time.',
   'CDL Class B license, 1+ years experience',
   'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true, NOW() - INTERVAL '60 days'),
  ('c3d4e5f6-a7b8-4901-c234-567890123456', 'Regional Truck Driver',
   'Regional routes with weekends home. Competitive pay and benefits package.',
   'CDL Class A license, 3+ years experience, Hazmat endorsement preferred',
   'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true, NOW() - INTERVAL '30 days'),
  ('d4e5f6a7-b8c9-4012-d345-678901234567', 'Tanker Driver',
   'Experienced tanker driver needed for specialized freight transport.',
   'CDL Class A license, Tanker endorsement, 5+ years experience',
   'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', false, NOW() - INTERVAL '120 days')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  updated_at = NOW();

-- ============================================================================
-- JOB QUESTIONS: Add questions to jobs
-- ============================================================================

INSERT INTO job_questions (job_id, question, question_type, required, "order", options)
VALUES
  -- Job 1: CDL Class A Driver
  ('a1b2c3d4-e5f6-4789-a012-345678901234', 'Do you have a Hazmat endorsement?', 'checkbox', true, 0, NULL),
  ('a1b2c3d4-e5f6-4789-a012-345678901234', 'How many years of long-haul experience do you have?', 'select', true, 1, '["0-1 years", "2-5 years", "5-10 years", "10+ years"]'::jsonb),
  ('a1b2c3d4-e5f6-4789-a012-345678901234', 'Are you willing to work weekends?', 'checkbox', true, 2, NULL),
  ('a1b2c3d4-e5f6-4789-a012-345678901234', 'Why are you interested in this position?', 'textarea', false, 3, NULL),
  -- Job 2: Local Delivery Driver
  ('b2c3d4e5-f6a7-4890-b123-456789012345', 'What is your preferred shift?', 'select', true, 0, '["Morning", "Afternoon", "Evening", "Flexible"]'::jsonb),
  ('b2c3d4e5-f6a7-4890-b123-456789012345', 'Do you have experience with local delivery routes?', 'checkbox', true, 1, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- APPLICATIONS: Various application statuses
-- ============================================================================

-- David - Submitted
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes)
VALUES
  ('11111111-1111-4111-a111-111111111111'::uuid, 'a1b2c3d4-e5f6-4789-a012-345678901234', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 
   'submitted', NOW() - INTERVAL '5 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Emily - Under Review
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes)
VALUES
  ('22222222-2222-4222-a222-222222222222'::uuid, 'a1b2c3d4-e5f6-4789-a012-345678901234', '7a8b9c0d-1e2f-4a3b-8c9d-0e1f2a3b4c5d',
   'under_review', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
   'Strong candidate, checking references')
ON CONFLICT (id) DO NOTHING;

-- Frank - Approved
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes)
VALUES
  ('33333333-3333-4333-a333-333333333333'::uuid, 'b2c3d4e5-f6a7-4890-b123-456789012345', '8b9c0d1e-2f3a-4b5c-9d0e-1f2a3b4c5d6e',
   'approved', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
   'Excellent candidate. All checks passed. Start date: Next Monday')
ON CONFLICT (id) DO NOTHING;

-- Grace - Rejected
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes)
VALUES
  ('44444444-4444-4444-a444-444444444444'::uuid, 'a1b2c3d4-e5f6-4789-a012-345678901234', '9c0d1e2f-3a4b-4c5d-0e1f-2a3b4c5d6e7f',
   'rejected', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
   'Does not meet minimum experience requirements')
ON CONFLICT (id) DO NOTHING;

-- Henry - More Info Requested
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes)
VALUES
  ('55555555-5555-4555-a555-555555555555'::uuid, 'c3d4e5f6-a7b8-4901-c234-567890123456', '0d1e2f3a-4b5c-4d5e-1f2a-3b4c5d6e7f8a',
   'more_info_requested', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
   'Need clarification on availability and previous employment gap')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- APPLICATION ANSWERS: Answers to job questions
-- ============================================================================

-- David's answers
INSERT INTO application_answers (application_id, question_id, answer)
SELECT '11111111-1111-4111-a111-111111111111'::uuid, id, 'true' FROM job_questions 
WHERE job_id = 'a1b2c3d4-e5f6-4789-a012-345678901234' AND question LIKE '%Hazmat%'
ON CONFLICT DO NOTHING;

INSERT INTO application_answers (application_id, question_id, answer)
SELECT '11111111-1111-4111-a111-111111111111'::uuid, id, '2-5 years' FROM job_questions 
WHERE job_id = 'a1b2c3d4-e5f6-4789-a012-345678901234' AND question LIKE '%years%'
ON CONFLICT DO NOTHING;

INSERT INTO application_answers (application_id, question_id, answer)
SELECT '11111111-1111-4111-a111-111111111111'::uuid, id, 'true' FROM job_questions 
WHERE job_id = 'a1b2c3d4-e5f6-4789-a012-345678901234' AND question LIKE '%weekends%'
ON CONFLICT DO NOTHING;

-- Emily's answers (same job)
INSERT INTO application_answers (application_id, question_id, answer)
SELECT '22222222-2222-4222-a222-222222222222'::uuid, id, 'true' FROM job_questions 
WHERE job_id = 'a1b2c3d4-e5f6-4789-a012-345678901234' AND question LIKE '%Hazmat%'
ON CONFLICT DO NOTHING;

INSERT INTO application_answers (application_id, question_id, answer)
SELECT '22222222-2222-4222-a222-222222222222'::uuid, id, '5-10 years' FROM job_questions 
WHERE job_id = 'a1b2c3d4-e5f6-4789-a012-345678901234' AND question LIKE '%years%'
ON CONFLICT DO NOTHING;

-- Frank's answers (different job)
INSERT INTO application_answers (application_id, question_id, answer)
SELECT '33333333-3333-4333-a333-333333333333'::uuid, id, 'Morning' FROM job_questions 
WHERE job_id = 'b2c3d4e5-f6a7-4890-b123-456789012345' AND question LIKE '%shift%'
ON CONFLICT DO NOTHING;

INSERT INTO application_answers (application_id, question_id, answer)
SELECT '33333333-3333-4333-a333-333333333333'::uuid, id, 'true' FROM job_questions 
WHERE job_id = 'b2c3d4e5-f6a7-4890-b123-456789012345' AND question LIKE '%local%'
ON CONFLICT DO NOTHING;

COMMIT;
