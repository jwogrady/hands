-- Seed data for development and testing
-- Using actual user IDs from auth.users
-- This seed file is idempotent - safe to run multiple times
-- Wrapped in transaction for atomicity

BEGIN;

-- ============================================================================
-- CONSTANTS: Define IDs as constants for maintainability
-- ============================================================================
-- User IDs
-- Manager: df0e04a4-4b3c-4666-9a68-a78f1d67f15f (john@status26.com)
-- Candidate 1: bfe9d5cd-8eca-4c82-83ee-dc0689844750 (alice@hands.test)
-- Candidate 2: 81d919d7-f558-4d84-bced-e9659828c08e (bob@hands.test)
-- Candidate 3: 8406cf66-046d-452d-800c-a6d7a914579f (carol@hands.test)

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
  'd0e1f2a3-b4c5-4678-d901-234567890123'
);

DELETE FROM applications 
WHERE id IN (
  'f6a7b8c9-d0e1-4234-f567-890123456789',
  'a7b8c9d0-e1f2-4345-a678-901234567890',
  'b8c9d0e1-f2a3-4456-b789-012345678901',
  'c9d0e1f2-a3b4-4567-c890-123456789012',
  'd0e1f2a3-b4c5-4678-d901-234567890123'
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
-- Update profiles using single UPDATE with CASE (more efficient)
UPDATE profiles 
SET 
  full_name = CASE user_id
    WHEN 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' THEN 'John Manager'
    WHEN 'bfe9d5cd-8eca-4c82-83ee-dc0689844750' THEN 'Alice Driver'
    WHEN '81d919d7-f558-4d84-bced-e9659828c08e' THEN 'Bob Trucker'
    WHEN '8406cf66-046d-452d-800c-a6d7a914579f' THEN 'Carol Hauler'
  END,
  phone = CASE user_id
    WHEN 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' THEN '555-0100'
    WHEN 'bfe9d5cd-8eca-4c82-83ee-dc0689844750' THEN '555-0200'
    WHEN '81d919d7-f558-4d84-bced-e9659828c08e' THEN '555-0201'
    WHEN '8406cf66-046d-452d-800c-a6d7a914579f' THEN '555-0202'
  END,
  email = CASE user_id
    WHEN 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' THEN 'john@status26.com'
    WHEN 'bfe9d5cd-8eca-4c82-83ee-dc0689844750' THEN 'alice@hands.test'
    WHEN '81d919d7-f558-4d84-bced-e9659828c08e' THEN 'bob@hands.test'
    WHEN '8406cf66-046d-452d-800c-a6d7a914579f' THEN 'carol@hands.test'
  END,
  updated_at = NOW()
WHERE user_id IN (
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f'
);

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
-- Alice's applications
('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'submitted', NOW() - INTERVAL '5 days', NULL, NULL, NULL),
('a7b8c9d0-e1f2-4345-a678-901234567890', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'under_review', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Strong candidate, reviewing documentation'),
-- Bob's applications
('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', '81d919d7-f558-4d84-bced-e9659828c08e', 'approved', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Excellent qualifications, offer extended'),
('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', '81d919d7-f558-4d84-bced-e9659828c08e', 'rejected', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Missing required hazmat endorsement'),
-- Carol's applications
('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', '8406cf66-046d-452d-800c-a6d7a914579f', 'more_info_requested', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Need clarification on employment history gap')
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  candidate_id = EXCLUDED.candidate_id,
  status = EXCLUDED.status,
  reviewed_at = EXCLUDED.reviewed_at,
  reviewed_by = EXCLUDED.reviewed_by,
  notes = EXCLUDED.notes,
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
    -- Alice's Long Haul answers
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 1, '3-5 years'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 2, 'Yes'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 3, 'I have been using ELDs for the past 4 years and am very comfortable with all features including HOS tracking and DVIR.'),
    -- Alice's Local Delivery answers
    ('a7b8c9d0-e1f2-4345-a678-901234567890', 'b2c3d4e5-f6a7-4890-b123-456789012345', 1, 'Yes'),
    ('a7b8c9d0-e1f2-4345-a678-901234567890', 'b2c3d4e5-f6a7-4890-b123-456789012345', 2, 'Yes'),
    -- Bob's Refrigerated answers
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 1, '5 years'),
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 2, 'Yes, very familiar'),
    -- Bob's Hazmat answers
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 1, '["H - Hazmat"]'),
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 2, '2 years')
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
