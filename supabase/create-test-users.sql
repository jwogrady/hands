-- Create test users with exact UUIDs required by seed.sql
-- This script must be run BEFORE running seed.sql
-- Run this in Supabase SQL Editor or via psql

-- Note: For local Supabase, we can insert directly into auth.users
-- Passwords are set to: "password123" (for all test users)
-- The password hash is bcrypt('password123') = $2a$10$rOhZk8qJ5ZqJ5ZqJ5ZqJ5OeJ5ZqJ5ZqJ5ZqJ5ZqJ5ZqJ5ZqJ5ZqJ

BEGIN;

-- Create test users with exact UUIDs
-- Password for all users: "password123"

-- Manager: john@status26.com
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'john@status26.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"John Manager"}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- Candidate 1 (NO PROFILE): alice@hands.test
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'alice@hands.test',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Alice Driver"}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- Candidate 2 (PARTIAL PROFILE): bob@hands.test
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '81d919d7-f558-4d84-bced-e9659828c08e'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'bob@hands.test',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Bob Trucker"}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- Candidate 3 (COMPLETE PROFILE): carol@hands.test
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '8406cf66-046d-452d-800c-a6d7a914579f'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'carol@hands.test',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Carol Hauler"}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- Candidate 4 (HIRED): david@hands.test
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'david@hands.test',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"David Professional"}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

COMMIT;

-- Verify users were created
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE id IN (
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  '3382f5ee-1a5c-4e8c-a99c-fc22acdf0216'
)
ORDER BY email;

