-- Seed data for development and testing
-- Using actual user IDs from auth.users
-- This seed file is idempotent - safe to run multiple times
-- Wrapped in transaction for atomicity
--
-- PROFILE TEST CASES:
-- ===================
-- 1. NO PROFILE (Alice - bfe9d5cd-8eca-4c82-83ee-dc0689844750):
--    - Basic profile info only (name, email)
--    - No additional profile data (SSN, DOB, address, CDL, etc.)
--    - No related data (employment history, background questions, etc.)
--    - profile_completed_at is NULL
--
-- 2. PARTIAL PROFILE (Bob - 81d919d7-f558-4d84-bced-e9659828c08e):
--    - Some profile data filled in (name, email, phone, SSN, DOB, address, CDL number/state)
--    - Missing: CDL expiration date, driving experience fields
--    - Partial related data (1 address history entry, 1 employment entry, 3 background questions, 1 emergency contact)
--    - profile_completed_at is NULL
--
-- 3. COMPLETE PROFILE (Carol - 8406cf66-046d-452d-800c-a6d7a914579f):
--    - All profile fields completed
--    - All related data complete (full address history, employment history, all background questions, all emergency contacts, all authorizations)
--    - profile_completed_at is set (30 days ago)
--
-- 4. HIRED CANDIDATE (David - 3382f5ee-1a5c-4e8c-a99c-fc22acdf0216):
--    - Complete profile with all fields filled
--    - All related data complete (full address history, employment history, all background questions, all emergency contacts, all authorizations)
--    - profile_completed_at is set (45 days ago)
--    - Application status: APPROVED (hired)
--    - Detailed application notes documenting hiring decision and case details
--    NOTE: This user ID must exist in auth.users before running this seed

BEGIN;

-- ============================================================================
-- CONSTANTS: Define IDs as constants for maintainability
-- ============================================================================
-- User IDs
-- Manager: df0e04a4-4b3c-4666-9a68-a78f1d67f15f (john@status26.com)
-- Candidate 1 (NO PROFILE): bfe9d5cd-8eca-4c82-83ee-dc0689844750 (alice@hands.test)
-- Candidate 2 (PARTIAL PROFILE): 81d919d7-f558-4d84-bced-e9659828c08e (bob@hands.test)
-- Candidate 3 (COMPLETE PROFILE): 8406cf66-046d-452d-800c-a6d7a914579f (carol@hands.test)
-- Candidate 4 (HIRED): 3382f5ee-1a5c-4e8c-a99c-fc22acdf0216 (david@hands.test)
-- NOTE: Hired candidate user must exist in auth.users before running seed

-- ============================================================================
-- CLEANUP: Remove existing seed data (if any)
-- ============================================================================
-- Delete in order to respect foreign key constraints
DELETE FROM application_answers 
WHERE application_id IN (
  'f6a7b8c9-d0e1-4234-f567-890123456789',
  'a7b8c9d0-e1f2-4345-a678-901234567890',
  'b8c9d0e1-f2a3-4456-b789-012345678901',
  'c9d0e1f2-a3b4-4567-c890-123456789012',
  'd0e1f2a3-b4c5-4678-d901-234567890123',
  'e1f2a3b4-c5d6-4789-e012-345678901234'
);

DELETE FROM applications 
WHERE id IN (
  'f6a7b8c9-d0e1-4234-f567-890123456789',
  'a7b8c9d0-e1f2-4345-a678-901234567890',
  'b8c9d0e1-f2a3-4456-b789-012345678901',
  'c9d0e1f2-a3b4-4567-c890-123456789012',
  'd0e1f2a3-b4c5-4678-d901-234567890123',
  'e1f2a3b4-c5d6-4789-e012-345678901234'
);

DELETE FROM job_questions 
WHERE job_id IN (
  'a1b2c3d4-e5f6-4789-a012-345678901234',
  'b2c3d4e5-f6a7-4890-b123-456789012345',
  'c3d4e5f6-a7b8-4901-c234-567890123456',
  'd4e5f6a7-b8c9-4012-d345-678901234567',
  'e5f6a7b8-c9d0-4123-e456-789012345678'
);

DELETE FROM jobs 
WHERE id IN (
  'a1b2c3d4-e5f6-4789-a012-345678901234',
  'b2c3d4e5-f6a7-4890-b123-456789012345',
  'c3d4e5f6-a7b8-4901-c234-567890123456',
  'd4e5f6a7-b8c9-4012-d345-678901234567',
  'e5f6a7b8-c9d0-4123-e456-789012345678'
);

-- ============================================================================
-- PROFILES TEST DATA
-- ============================================================================
-- Case 1: NO PROFILE - Alice (bfe9d5cd-8eca-4c82-83ee-dc0689844750)
-- Just basic info from trigger, no additional profile data
UPDATE profiles 
SET 
  full_name = 'Alice Driver',
  email = 'alice@hands.test',
  phone = NULL,
  -- All other fields remain NULL (no profile data)
  updated_at = NOW()
WHERE user_id = 'bfe9d5cd-8eca-4c82-83ee-dc0689844750';

-- Case 2: PARTIAL PROFILE - Bob (81d919d7-f558-4d84-bced-e9659828c08e)
-- Some profile data filled in but not complete
UPDATE profiles 
SET 
  full_name = 'Bob Trucker',
  email = 'bob@hands.test',
  phone = '555-0201',
  ssn = '123-45-6789',
  date_of_birth = '1985-05-15',
  present_address_street = '123 Main Street',
  present_address_city = 'Springfield',
  present_address_state = 'IL',
  present_address_zip = '62701',
  cdl_number = 'CDL123456',
  cdl_state = 'IL',
  -- Missing: cdl_expiration_date, driving_experience fields
  -- Missing: profile_completed_at (not complete)
  updated_at = NOW()
WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

-- Case 3: COMPLETE PROFILE - Carol (8406cf66-046d-452d-800c-a6d7a914579f)
-- All profile data complete with profile_completed_at set
UPDATE profiles 
SET 
  full_name = 'Carol Hauler',
  email = 'carol@hands.test',
  phone = '555-0202',
  ssn = '987-65-4321',
  date_of_birth = '1990-08-22',
  present_address_street = '456 Oak Avenue',
  present_address_city = 'Chicago',
  present_address_state = 'IL',
  present_address_zip = '60601',
  cdl_number = 'CDL789012',
  cdl_state = 'IL',
  cdl_expiration_date = '2026-12-31',
  driving_experience_years = 8,
  driving_experience_miles = 500000,
  driving_experience_equipment = '["Tractor-Trailer", "Refrigerated", "Flatbed"]'::jsonb,
  profile_completed_at = NOW() - INTERVAL '30 days',
  updated_at = NOW()
WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

-- Case 4: HIRED CANDIDATE - David (3382f5ee-1a5c-4e8c-a99c-fc22acdf0216)
-- Complete profile with all data - HIRED status
UPDATE profiles 
SET 
  full_name = 'David Professional',
  email = 'david@hands.test',
  phone = '555-0203',
  ssn = '555-11-2222',
  date_of_birth = '1988-03-10',
  present_address_street = '789 Professional Drive',
  present_address_city = 'Aurora',
  present_address_state = 'IL',
  present_address_zip = '60505',
  cdl_number = 'CDL345678',
  cdl_state = 'IL',
  cdl_expiration_date = '2027-06-30',
  driving_experience_years = 12,
  driving_experience_miles = 850000,
  driving_experience_equipment = '["Tractor-Trailer", "Refrigerated", "Tanker", "Flatbed", "Double/Triple"]'::jsonb,
  profile_completed_at = NOW() - INTERVAL '45 days',
  updated_at = NOW()
WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

-- Manager profile
UPDATE profiles 
SET 
  full_name = 'John Manager',
  email = 'john@status26.com',
  phone = '555-0100',
  updated_at = NOW()
WHERE user_id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f';

-- ============================================================================
-- USER ROLES TEST DATA
-- ============================================================================
UPDATE user_roles 
SET role = 'manager'
WHERE user_id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f';

-- ============================================================================
-- JOBS TEST DATA
-- ============================================================================
INSERT INTO jobs (id, title, description, requirements, created_by, is_active) 
VALUES
(
  'a1b2c3d4-e5f6-4789-a012-345678901234',
  'Long Haul Truck Driver',
  'Seeking experienced long-haul truck drivers for cross-country routes. Must be comfortable with extended time away from home.',
  '• Valid CDL Class A license' || E'\n' || 
  '• Minimum 2 years experience' || E'\n' || 
  '• Clean driving record' || E'\n' || 
  '• DOT medical card' || E'\n' || 
  '• Ability to pass drug screening',
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  true
),
(
  'b2c3d4e5-f6a7-4890-b123-456789012345',
  'Local Delivery Driver',
  'Local delivery driver position for daily routes within 100-mile radius. Home daily.',
  '• Valid CDL Class B license' || E'\n' || 
  '• Clean driving record' || E'\n' || 
  '• Customer service skills' || E'\n' || 
  '• Physical ability to load/unload',
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  true
),
(
  'c3d4e5f6-a7b8-4901-c234-567890123456',
  'Refrigerated Truck Driver',
  'Experienced driver needed for refrigerated freight transport. Temperature-controlled cargo experience preferred.',
  '• Valid CDL Class A license' || E'\n' || 
  '• Refrigerated cargo experience' || E'\n' || 
  '• Temperature monitoring knowledge' || E'\n' || 
  '• DOT certified',
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  true
),
(
  'd4e5f6a7-b8c9-4012-d345-678901234567',
  'Hazmat Certified Driver',
  'Hazmat certified driver for specialized cargo transport. Premium pay for qualified candidates.',
  '• Valid CDL Class A license' || E'\n' || 
  '• Hazmat endorsement (H)' || E'\n' || 
  '• Tanker endorsement preferred' || E'\n' || 
  '• Clean MVR for 5 years',
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  true
),
(
  'e5f6a7b8-c9d0-4123-e456-789012345678',
  'Owner Operator Position',
  'Seeking owner-operators for contract work. Competitive rates and flexible scheduling.',
  '• Own truck and trailer' || E'\n' || 
  '• Valid CDL' || E'\n' || 
  '• Insurance coverage' || E'\n' || 
  '• 3+ years experience',
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================================================
-- JOB QUESTIONS TEST DATA
-- ============================================================================
INSERT INTO job_questions (job_id, question, question_type, required, "order", options) 
VALUES
-- Questions for Long Haul Truck Driver
('a1b2c3d4-e5f6-4789-a012-345678901234', 'How many years of long-haul driving experience do you have?', 'select', true, 1, '["Less than 1 year", "1-2 years", "3-5 years", "5+ years"]'::jsonb),
('a1b2c3d4-e5f6-4789-a012-345678901234', 'Are you comfortable being away from home for extended periods (2+ weeks)?', 'select', true, 2, '["Yes", "No", "Prefer shorter trips"]'::jsonb),
('a1b2c3d4-e5f6-4789-a012-345678901234', 'Please describe your experience with electronic logging devices (ELDs)', 'textarea', true, 3, NULL),
-- Questions for Local Delivery Driver
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Do you have experience with local delivery routes?', 'select', true, 1, '["Yes", "No"]'::jsonb),
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Can you lift and carry packages up to 50 lbs?', 'select', true, 2, '["Yes", "No"]'::jsonb),
-- Questions for Refrigerated Truck Driver
('c3d4e5f6-a7b8-4901-c234-567890123456', 'How many years of refrigerated cargo experience do you have?', 'text', true, 1, NULL),
('c3d4e5f6-a7b8-4901-c234-567890123456', 'Are you familiar with temperature monitoring and documentation?', 'select', true, 2, '["Yes, very familiar", "Somewhat familiar", "No experience"]'::jsonb),
-- Questions for Hazmat Certified Driver
('d4e5f6a7-b8c9-4012-d345-678901234567', 'Which hazmat endorsements do you currently hold? (Select all that apply)', 'checkbox', true, 1, '["H - Hazmat", "N - Tanker", "X - Tanker/Hazmat combo"]'::jsonb),
('d4e5f6a7-b8c9-4012-d345-678901234567', 'How long have you held your hazmat endorsement?', 'text', true, 2, NULL);

-- ============================================================================
-- APPLICATIONS TEST DATA
-- ============================================================================
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes) 
VALUES
-- Alice's applications (NO PROFILE - can still apply but profile incomplete)
('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'submitted', NOW() - INTERVAL '5 days', NULL, NULL, 'Profile incomplete - candidate needs to complete profile'),
-- Bob's applications (PARTIAL PROFILE - some data but not complete)
('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', '81d919d7-f558-4d84-bced-e9659828c08e', 'under_review', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Partial profile - missing some required fields'),
('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', '81d919d7-f558-4d84-bced-e9659828c08e', 'rejected', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Missing required hazmat endorsement'),
-- Carol's applications (COMPLETE PROFILE - all data complete)
('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', '8406cf66-046d-452d-800c-a6d7a914579f', 'approved', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Complete profile - excellent candidate'),
-- David's application (HIRED CANDIDATE - complete profile, approved/hired status)
('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'approved', NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 
'=== HIRED CANDIDATE - CASE DETAILS ===
PROFILE STATUS: Complete
- All required profile fields completed
- Full address history (3+ years) documented
- Complete employment history (10+ years, including 7-year CDL history)
- All 9 background questions answered (no disqualifying answers)
- All 3 emergency contacts provided
- All 4 required authorizations signed and dated

QUALIFICATIONS:
- CDL Class A: IL CDL345678 (expires 2027-06-30)
- 12 years driving experience, 850,000+ miles
- Equipment types: Tractor-Trailer, Refrigerated, Tanker, Flatbed, Double/Triple
- Clean driving record (verified through PSP and FMCSA Clearinghouse)
- DOT medical card current

BACKGROUND CHECKS:
- FMCSA Clearinghouse: Clear (no drug/alcohol violations)
- PSP Record: Clean (no serious violations in 3 years)
- HireRight Background: Passed (no criminal history)
- Employment verification: All previous employers verified (10+ years)

APPLICATION REVIEW:
- Application submitted: 14 days ago
- Initial review: 12 days ago
- Background checks initiated: 11 days ago
- Background checks completed: 10 days ago
- Interview conducted: 9 days ago (excellent communication skills)
- References checked: 8 days ago (all positive)
- Offer extended: 7 days ago
- Offer accepted: 6 days ago
- Start date scheduled: 3 days from now

HIRING DECISION: APPROVED - HIRED
- Candidate meets all job requirements
- Excellent safety record and experience
- Strong references and employment history
- Complete documentation received
- Ready for onboarding

NEXT STEPS:
- Onboarding scheduled
- Orientation materials sent
- Equipment assignment pending
- First route assignment: TBD')
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  candidate_id = EXCLUDED.candidate_id,
  status = EXCLUDED.status,
  reviewed_at = EXCLUDED.reviewed_at,
  reviewed_by = EXCLUDED.reviewed_by,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ============================================================================
-- ADDRESS HISTORY TEST DATA
-- ============================================================================
-- Partial profile (Bob) - has one address history entry
DELETE FROM address_history WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
('81d919d7-f558-4d84-bced-e9659828c08e', '123 Main Street', 'Springfield', 'IL', '62701', '2021-01-01', NULL)
ON CONFLICT DO NOTHING;

-- Complete profile (Carol) - has full address history
DELETE FROM address_history WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', '456 Oak Avenue', 'Chicago', 'IL', '60601', '2022-01-01', NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', '789 Pine Street', 'Springfield', 'IL', '62701', '2020-06-01', '2021-12-31'),
('8406cf66-046d-452d-800c-a6d7a914579f', '321 Elm Drive', 'Peoria', 'IL', '61601', '2018-01-01', '2020-05-31')
ON CONFLICT DO NOTHING;

-- Hired candidate (David) - has full address history
DELETE FROM address_history WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '789 Professional Drive', 'Aurora', 'IL', '60505', '2021-03-01', NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '654 Business Blvd', 'Naperville', 'IL', '60540', '2019-05-15', '2021-02-28'),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', '321 Career Court', 'Joliet', 'IL', '60435', '2017-01-01', '2019-05-14')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- EMPLOYMENT HISTORY TEST DATA
-- ============================================================================
-- Partial profile (Bob) - has partial employment history
DELETE FROM employment_history WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

INSERT INTO employment_history (
  user_id, company_name, company_address_street, company_address_city, company_address_state,
  company_address_zip, supervisor_name, supervisor_phone, start_date, end_date,
  reason_for_leaving, cdl_required, is_cdl_employment
)
VALUES
-- Only one employment entry (incomplete)
('81d919d7-f558-4d84-bced-e9659828c08e', 'Quick Transport', '150 Truck Lane', 'Springfield', 'IL', '62701',
 'Jim Boss', '555-3001', '2022-06-01', NULL, NULL, true, false)
ON CONFLICT DO NOTHING;

-- Complete profile (Carol) - has full employment history
DELETE FROM employment_history WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

INSERT INTO employment_history (
  user_id, company_name, company_address_street, company_address_city, company_address_state,
  company_address_zip, supervisor_name, supervisor_phone, supervisor_email,
  start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment
)
VALUES
-- Last 3 years (all employment)
('8406cf66-046d-452d-800c-a6d7a914579f', 'ABC Logistics', '100 Warehouse Blvd', 'Chicago', 'IL', '60601',
 'Mike Supervisor', '555-1001', 'mike@abclogistics.com', '2022-01-15', NULL, NULL, true, false),
('8406cf66-046d-452d-800c-a6d7a914579f', 'XYZ Transport', '200 Trucking Way', 'Springfield', 'IL', '62701',
 'Sarah Johnson', '555-1002', 'sarah@xyztransport.com', '2020-03-01', '2021-12-15', 'Better opportunity', true, false),
-- Additional 7 years CDL employment
('8406cf66-046d-452d-800c-a6d7a914579f', 'Long Haul Express', '300 Highway Road', 'Peoria', 'IL', '61601',
 'Tom Manager', '555-1003', 'tom@longhaul.com', '2017-01-01', '2020-02-28', 'Company relocation', true, true),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Freight Masters', '400 Cargo Lane', 'Rockford', 'IL', '61101',
 'Lisa Director', '555-1004', 'lisa@freightmasters.com', '2015-06-01', '2016-12-31', 'Career advancement', true, true)
ON CONFLICT DO NOTHING;

-- Hired candidate (David) - has full employment history (10+ years)
DELETE FROM employment_history WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

INSERT INTO employment_history (
  user_id, company_name, company_address_street, company_address_city, company_address_state,
  company_address_zip, supervisor_name, supervisor_phone, supervisor_email,
  start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment
)
VALUES
-- Last 3 years (all employment)
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Premium Transport Co', '500 Elite Way', 'Aurora', 'IL', '60505',
 'Robert Manager', '555-5001', 'robert@premiumtransport.com', '2021-08-01', NULL, 'New opportunity', true, false),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Regional Freight Lines', '600 Regional Ave', 'Naperville', 'IL', '60540',
 'Jennifer Director', '555-5002', 'jennifer@regionalfreight.com', '2019-01-15', '2021-07-31', 'Career growth', true, false),
-- Additional 7 years CDL employment
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Cross Country Carriers', '700 Highway Blvd', 'Joliet', 'IL', '60435',
 'Michael VP', '555-5003', 'michael@crosscountry.com', '2015-03-01', '2018-12-31', 'Better routes', true, true),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Long Distance Logistics', '800 Miles Road', 'Chicago', 'IL', '60601',
 'Patricia Owner', '555-5004', 'patricia@longdist.com', '2012-06-01', '2015-02-28', 'Company acquisition', true, true),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'First Class Freight', '900 Quality St', 'Rockford', 'IL', '61101',
 'James Supervisor', '555-5005', 'james@firstclass.com', '2010-01-01', '2012-05-31', 'Expanded opportunities', true, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- BACKGROUND QUESTIONS TEST DATA
-- ============================================================================
-- Partial profile (Bob) - has some background questions answered
DELETE FROM background_questions WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
('81d919d7-f558-4d84-bced-e9659828c08e', 1, false, NULL),
('81d919d7-f558-4d84-bced-e9659828c08e', 2, false, NULL),
('81d919d7-f558-4d84-bced-e9659828c08e', 3, false, NULL)
-- Missing questions 4-9 (partial)
ON CONFLICT (user_id, question_number) DO UPDATE SET
  answer = EXCLUDED.answer,
  explanation = EXCLUDED.explanation,
  updated_at = NOW();

-- Complete profile (Carol) - has all background questions answered
DELETE FROM background_questions WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 1, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 2, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 3, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 4, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 5, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 6, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 7, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 8, false, NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', 9, true, NULL)
ON CONFLICT (user_id, question_number) DO UPDATE SET
  answer = EXCLUDED.answer,
  explanation = EXCLUDED.explanation,
  updated_at = NOW();

-- Hired candidate (David) - has all background questions answered (all NO - clean record)
DELETE FROM background_questions WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 1, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 2, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 3, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 4, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 5, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 6, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 7, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 8, false, NULL),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 9, false, NULL)
ON CONFLICT (user_id, question_number) DO UPDATE SET
  answer = EXCLUDED.answer,
  explanation = EXCLUDED.explanation,
  updated_at = NOW();

-- ============================================================================
-- EMERGENCY CONTACTS TEST DATA
-- ============================================================================
-- Partial profile (Bob) - has one emergency contact (incomplete)
DELETE FROM emergency_contacts WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
('81d919d7-f558-4d84-bced-e9659828c08e', 'Jane Trucker', '123 Main Street', 'Springfield', 'IL', '62701', 'Spouse', '555-4001', 0)
ON CONFLICT DO NOTHING;

-- Complete profile (Carol) - has all emergency contacts
DELETE FROM emergency_contacts WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 'John Hauler', '456 Oak Avenue', 'Chicago', 'IL', '60601', 'Spouse', '555-2001', 0),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Mary Hauler', '789 Family Lane', 'Chicago', 'IL', '60601', 'Mother', '555-2002', 1),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Robert Friend', '321 Friend Street', 'Springfield', 'IL', '62701', 'Friend', '555-2003', 2)
ON CONFLICT DO NOTHING;

-- Hired candidate (David) - has all emergency contacts
DELETE FROM emergency_contacts WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Susan Professional', '789 Professional Drive', 'Aurora', 'IL', '60505', 'Spouse', '555-6001', 0),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Thomas Professional', '123 Parent Ave', 'Aurora', 'IL', '60505', 'Father', '555-6002', 1),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'Jennifer Colleague', '456 Work Street', 'Naperville', 'IL', '60540', 'Friend', '555-6003', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- AUTHORIZATIONS TEST DATA
-- ============================================================================
-- Complete profile (Carol)
DELETE FROM authorizations WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';

INSERT INTO authorizations (user_id, authorization_type, signed, signed_at)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 'applicant_certification', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'hireright_background', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'psp_authorization', true, NOW() - INTERVAL '30 days')
ON CONFLICT (user_id, authorization_type) DO UPDATE SET
  signed = EXCLUDED.signed,
  signed_at = EXCLUDED.signed_at,
  updated_at = NOW();

-- Hired candidate (David) - all authorizations signed
DELETE FROM authorizations WHERE user_id = '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216';

INSERT INTO authorizations (user_id, authorization_type, signed, signed_at)
VALUES
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'applicant_certification', true, NOW() - INTERVAL '45 days'),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '45 days'),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'hireright_background', true, NOW() - INTERVAL '45 days'),
('3382f5ee-1a5c-4e8c-a99c-fc22acdf0216', 'psp_authorization', true, NOW() - INTERVAL '45 days')
ON CONFLICT (user_id, authorization_type) DO UPDATE SET
  signed = EXCLUDED.signed,
  signed_at = EXCLUDED.signed_at,
  updated_at = NOW();

-- ============================================================================
-- APPLICATION ANSWERS TEST DATA
-- ============================================================================
-- Use CTE to get question IDs once, then insert all answers in single statement
WITH question_ids AS (
  SELECT 
    id as q_id,
    job_id,
    "order"
  FROM job_questions
  WHERE job_id IN (
    'a1b2c3d4-e5f6-4789-a012-345678901234',
    'b2c3d4e5-f6a7-4890-b123-456789012345',
    'c3d4e5f6-a7b8-4901-c234-567890123456',
    'd4e5f6a7-b8c9-4012-d345-678901234567'
  )
),
answer_data AS (
  SELECT * FROM (VALUES
    -- Alice's Long Haul answers (NO PROFILE case)
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 1, '3-5 years'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 2, 'Yes'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 3, 'I have been using ELDs for the past 4 years and am very comfortable with all features including HOS tracking and DVIR.'),
    -- Bob's Refrigerated answers (PARTIAL PROFILE case)
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 1, '5 years'),
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 2, 'Yes, very familiar'),
    -- Bob's Hazmat answers (PARTIAL PROFILE case)
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 1, '["H - Hazmat"]'),
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 2, '2 years'),
    -- Carol's Long Haul answers (COMPLETE PROFILE case)
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 1, '5+ years'),
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 2, 'Yes'),
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 3, 'Extensive experience with ELDs, including compliance monitoring and DVIR documentation.'),
    -- David's Local Delivery answers (HIRED CANDIDATE case)
    ('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 1, 'Yes'),
    ('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 2, 'Yes')
  ) AS t(application_id, job_id, question_order, answer)
)
INSERT INTO application_answers (application_id, question_id, answer)
SELECT 
  ad.application_id::uuid,
  qi.q_id,
  ad.answer
FROM answer_data ad
JOIN question_ids qi ON qi.job_id = ad.job_id::uuid AND qi."order" = ad.question_order
ON CONFLICT (application_id, question_id) DO UPDATE SET
  answer = EXCLUDED.answer;

COMMIT;
