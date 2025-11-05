-- Complete Seed File for Hands Driver Screening Platform
-- This file includes all schema migrations and seed data
-- Safe to run multiple times (idempotent)
-- Wrapped in transaction for atomicity
--
-- ⚠️  IMPORTANT PREREQUISITES:
-- ============================
-- 1. All test users MUST exist in auth.users before running this seed
--    Required user IDs:
--    - df0e04a4-4b3c-4666-9a68-a78f1d67f15f (john@status26.com) - Manager
--    - bfe9d5cd-8eca-4c82-83ee-dc0689844750 (alice@hands.test) - Candidate (No Profile)
--    - 81d919d7-f558-4d84-bced-e9659828c08e (bob@hands.test) - Candidate (Partial Profile)
--    - 8406cf66-046d-452d-800c-a6d7a914579f (carol@hands.test) - Candidate (Complete Profile)
--    - e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b (david@hands.test) - Candidate (Hired)
--
--    To create users:
--    - Use Supabase Dashboard → Authentication → Users → Add User
--    - Or sign up via the application interface
--    - Users will be auto-created by the trigger when they sign up
--
-- 2. Foreign key constraints reference auth.users(id), so users must exist first
--
-- 3. If you get FK errors, verify users exist:
--    SELECT id, email FROM auth.users WHERE id IN (
--      'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
--      'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
--      '81d919d7-f558-4d84-bced-e9659828c08e',
--      '8406cf66-046d-452d-800c-a6d7a914579f',
--      'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b'
--    );

BEGIN;

-- ============================================================================
-- VERIFICATION: Check that all required users exist in auth.users
-- ============================================================================
-- If any users are missing, this will show which ones need to be created
DO $$
DECLARE
  missing_users TEXT[];
  required_user_ids UUID[] := ARRAY[
    'df0e04a4-4b3c-4666-9a68-a78f1d67f15f'::uuid,
    'bfe9d5cd-8eca-4c82-83ee-dc0689844750'::uuid,
    '81d919d7-f558-4d84-bced-e9659828c08e'::uuid,
    '8406cf66-046d-452d-800c-a6d7a914579f'::uuid,
    'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b'::uuid
  ];
BEGIN
  SELECT ARRAY_AGG(required_id::text)
  INTO missing_users
  FROM unnest(required_user_ids) AS required_id
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = required_id
  );
  
  IF array_length(missing_users, 1) > 0 THEN
    RAISE EXCEPTION 'Missing required users in auth.users. Please create these users first: %', array_to_string(missing_users, ', ');
  END IF;
END $$;

-- ============================================================================
-- SCHEMA: Initial Schema (Migration 20250101000000)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_questions table
CREATE TABLE IF NOT EXISTS job_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('text', 'textarea', 'select', 'checkbox')),
  required BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  options JSONB, -- For select/checkbox types
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'more_info_requested')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create application_answers table
CREATE TABLE IF NOT EXISTS application_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES job_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, question_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_job_questions_job_id ON job_questions(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_application_answers_application_id ON application_answers(application_id);
CREATE INDEX IF NOT EXISTS idx_application_answers_question_id ON application_answers(question_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view all profiles" ON profiles;
CREATE POLICY "Managers can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view all roles" ON user_roles;
CREATE POLICY "Managers can view all roles" ON user_roles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- RLS Policies for jobs
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Managers can manage jobs" ON jobs;
CREATE POLICY "Managers can manage jobs" ON jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- RLS Policies for job_questions
DROP POLICY IF EXISTS "Anyone can view job questions for active jobs" ON job_questions;
CREATE POLICY "Anyone can view job questions for active jobs" ON job_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_questions.job_id AND jobs.is_active = TRUE)
);

DROP POLICY IF EXISTS "Managers can manage job questions" ON job_questions;
CREATE POLICY "Managers can manage job questions" ON job_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- RLS Policies for applications
DROP POLICY IF EXISTS "Candidates can view own applications" ON applications;
CREATE POLICY "Candidates can view own applications" ON applications FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Candidates can create applications" ON applications;
CREATE POLICY "Candidates can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Managers can view all applications" ON applications;
CREATE POLICY "Managers can view all applications" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

DROP POLICY IF EXISTS "Managers can update applications" ON applications;
CREATE POLICY "Managers can update applications" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- RLS Policies for application_answers
DROP POLICY IF EXISTS "Candidates can view own application answers" ON application_answers;
CREATE POLICY "Candidates can view own application answers" ON application_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM applications WHERE applications.id = application_answers.application_id AND applications.candidate_id = auth.uid())
);

DROP POLICY IF EXISTS "Candidates can create application answers" ON application_answers;
CREATE POLICY "Candidates can create application answers" ON application_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM applications WHERE applications.id = application_answers.application_id AND applications.candidate_id = auth.uid())
);

DROP POLICY IF EXISTS "Managers can view all application answers" ON application_answers;
CREATE POLICY "Managers can view all application answers" ON application_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name)
  VALUES (NEW.id, NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Default role is candidate
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'candidate');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SCHEMA: Extended Candidate Profile Fields (Migration 20250102000000)
-- ============================================================================

-- Extend profiles table with candidate-specific fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS ssn TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS present_address_street TEXT,
  ADD COLUMN IF NOT EXISTS present_address_city TEXT,
  ADD COLUMN IF NOT EXISTS present_address_state TEXT,
  ADD COLUMN IF NOT EXISTS present_address_zip TEXT,
  ADD COLUMN IF NOT EXISTS cdl_number TEXT,
  ADD COLUMN IF NOT EXISTS cdl_state TEXT,
  ADD COLUMN IF NOT EXISTS cdl_expiration_date DATE,
  ADD COLUMN IF NOT EXISTS driving_experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS driving_experience_miles INTEGER,
  ADD COLUMN IF NOT EXISTS driving_experience_equipment JSONB,
  ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMPTZ;

-- Create address_history table (for last 3 years of addresses)
CREATE TABLE IF NOT EXISTS address_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create employment_history table
CREATE TABLE IF NOT EXISTS employment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_address_street TEXT,
  company_address_city TEXT,
  company_address_state TEXT,
  company_address_zip TEXT,
  supervisor_name TEXT,
  supervisor_phone TEXT,
  supervisor_email TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  reason_for_leaving TEXT,
  cdl_required BOOLEAN DEFAULT FALSE,
  is_cdl_employment BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create background_questions table
CREATE TABLE IF NOT EXISTS background_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL CHECK (question_number BETWEEN 1 AND 9),
  answer BOOLEAN NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_number)
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address_street TEXT,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table (metadata for uploaded documents)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('resume', 'cdl_license', 'certification', 'other')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create authorizations table
CREATE TABLE IF NOT EXISTS authorizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  authorization_type TEXT NOT NULL CHECK (authorization_type IN ('applicant_certification', 'fmcsa_clearinghouse', 'hireright_background', 'psp_authorization')),
  signed BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, authorization_type)
);

-- Create indexes for extended schema
CREATE INDEX IF NOT EXISTS idx_address_history_user_id ON address_history(user_id);
CREATE INDEX IF NOT EXISTS idx_employment_history_user_id ON employment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_employment_history_cdl ON employment_history(user_id, is_cdl_employment);
CREATE INDEX IF NOT EXISTS idx_background_questions_user_id ON background_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_authorizations_user_id ON authorizations(user_id);

-- Enable RLS for extended tables
ALTER TABLE address_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for address_history
DROP POLICY IF EXISTS "Users can manage own address history" ON address_history;
CREATE POLICY "Users can manage own address history"
  ON address_history FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view address history" ON address_history;
CREATE POLICY "Managers can view address history"
  ON address_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- RLS Policies for employment_history
DROP POLICY IF EXISTS "Users can manage own employment history" ON employment_history;
CREATE POLICY "Users can manage own employment history"
  ON employment_history FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view employment history" ON employment_history;
CREATE POLICY "Managers can view employment history"
  ON employment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- RLS Policies for background_questions
DROP POLICY IF EXISTS "Users can manage own background questions" ON background_questions;
CREATE POLICY "Users can manage own background questions"
  ON background_questions FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view background questions" ON background_questions;
CREATE POLICY "Managers can view background questions"
  ON background_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- RLS Policies for emergency_contacts
DROP POLICY IF EXISTS "Users can manage own emergency contacts" ON emergency_contacts;
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view emergency contacts" ON emergency_contacts;
CREATE POLICY "Managers can view emergency contacts"
  ON emergency_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- RLS Policies for documents
DROP POLICY IF EXISTS "Users can manage own documents" ON documents;
CREATE POLICY "Users can manage own documents"
  ON documents FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view documents" ON documents;
CREATE POLICY "Managers can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- RLS Policies for authorizations
DROP POLICY IF EXISTS "Users can manage own authorizations" ON authorizations;
CREATE POLICY "Users can manage own authorizations"
  ON authorizations FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view authorizations" ON authorizations;
CREATE POLICY "Managers can view authorizations"
  ON authorizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

-- ============================================================================
-- SEED DATA: Test Data
-- ============================================================================

-- User IDs
-- Manager: df0e04a4-4b3c-4666-9a68-a78f1d67f15f (john@status26.com)
-- Candidate 1 (NO PROFILE): bfe9d5cd-8eca-4c82-83ee-dc0689844750 (alice@hands.test)
-- Candidate 2 (PARTIAL PROFILE): 81d919d7-f558-4d84-bced-e9659828c08e (bob@hands.test)
-- Candidate 3 (COMPLETE PROFILE): 8406cf66-046d-452d-800c-a6d7a914579f (carol@hands.test)
-- Candidate 4 (HIRED): e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b (david@hands.test)

-- Cleanup existing seed data
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

-- Profiles
UPDATE profiles 
SET 
  full_name = 'Alice Driver',
  email = 'alice@hands.test',
  phone = NULL,
  updated_at = NOW()
WHERE user_id = 'bfe9d5cd-8eca-4c82-83ee-dc0689844750';

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
  updated_at = NOW()
WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';

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
WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';

UPDATE profiles 
SET 
  full_name = 'John Manager',
  email = 'john@status26.com',
  phone = '555-0100',
  updated_at = NOW()
WHERE user_id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f';

-- User Roles
INSERT INTO user_roles (user_id, role)
VALUES ('df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'manager')
ON CONFLICT (user_id, role) DO UPDATE SET role = EXCLUDED.role;

-- Jobs
INSERT INTO jobs (id, title, description, requirements, created_by, is_active) 
VALUES
('a1b2c3d4-e5f6-4789-a012-345678901234', 'Long Haul Truck Driver', 'Seeking experienced long-haul truck drivers for cross-country routes. Must be comfortable with extended time away from home.', '• Valid CDL Class A license' || E'\n' || '• Minimum 2 years experience' || E'\n' || '• Clean driving record' || E'\n' || '• DOT medical card' || E'\n' || '• Ability to pass drug screening', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true),
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Local Delivery Driver', 'Local delivery driver position for daily routes within 100-mile radius. Home daily.', '• Valid CDL Class B license' || E'\n' || '• Clean driving record' || E'\n' || '• Customer service skills' || E'\n' || '• Physical ability to load/unload', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true),
('c3d4e5f6-a7b8-4901-c234-567890123456', 'Refrigerated Truck Driver', 'Experienced driver needed for refrigerated freight transport. Temperature-controlled cargo experience preferred.', '• Valid CDL Class A license' || E'\n' || '• Refrigerated cargo experience' || E'\n' || '• Temperature monitoring knowledge' || E'\n' || '• DOT certified', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true),
('d4e5f6a7-b8c9-4012-d345-678901234567', 'Hazmat Certified Driver', 'Hazmat certified driver for specialized cargo transport. Premium pay for qualified candidates.', '• Valid CDL Class A license' || E'\n' || '• Hazmat endorsement (H)' || E'\n' || '• Tanker endorsement preferred' || E'\n' || '• Clean MVR for 5 years', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', true),
('e5f6a7b8-c9d0-4123-e456-789012345678', 'Owner Operator Position', 'Seeking owner-operators for contract work. Competitive rates and flexible scheduling.', '• Own truck and trailer' || E'\n' || '• Valid CDL' || E'\n' || '• Insurance coverage' || E'\n' || '• 3+ years experience', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Job Questions
INSERT INTO job_questions (job_id, question, question_type, required, "order", options) 
VALUES
('a1b2c3d4-e5f6-4789-a012-345678901234', 'How many years of long-haul driving experience do you have?', 'select', true, 1, '["Less than 1 year", "1-2 years", "3-5 years", "5+ years"]'::jsonb),
('a1b2c3d4-e5f6-4789-a012-345678901234', 'Are you comfortable being away from home for extended periods (2+ weeks)?', 'select', true, 2, '["Yes", "No", "Prefer shorter trips"]'::jsonb),
('a1b2c3d4-e5f6-4789-a012-345678901234', 'Please describe your experience with electronic logging devices (ELDs)', 'textarea', true, 3, NULL),
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Do you have experience with local delivery routes?', 'select', true, 1, '["Yes", "No"]'::jsonb),
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Can you lift and carry packages up to 50 lbs?', 'select', true, 2, '["Yes", "No"]'::jsonb),
('c3d4e5f6-a7b8-4901-c234-567890123456', 'How many years of refrigerated cargo experience do you have?', 'text', true, 1, NULL),
('c3d4e5f6-a7b8-4901-c234-567890123456', 'Are you familiar with temperature monitoring and documentation?', 'select', true, 2, '["Yes, very familiar", "Somewhat familiar", "No experience"]'::jsonb),
('d4e5f6a7-b8c9-4012-d345-678901234567', 'Which hazmat endorsements do you currently hold? (Select all that apply)', 'checkbox', true, 1, '["H - Hazmat", "N - Tanker", "X - Tanker/Hazmat combo"]'::jsonb),
('d4e5f6a7-b8c9-4012-d345-678901234567', 'How long have you held your hazmat endorsement?', 'text', true, 2, NULL);

-- Applications
INSERT INTO applications (id, job_id, candidate_id, status, submitted_at, reviewed_at, reviewed_by, notes) 
VALUES
('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 'bfe9d5cd-8eca-4c82-83ee-dc0689844750', 'submitted', NOW() - INTERVAL '5 days', NULL, NULL, 'Profile incomplete - candidate needs to complete profile'),
('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', '81d919d7-f558-4d84-bced-e9659828c08e', 'under_review', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Partial profile - missing some required fields'),
('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', '81d919d7-f558-4d84-bced-e9659828c08e', 'rejected', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Missing required hazmat endorsement'),
('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', '8406cf66-046d-452d-800c-a6d7a914579f', 'approved', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', 'Complete profile - excellent candidate'),
('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'approved', NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days', 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f', '=== HIRED CANDIDATE - CASE DETAILS ===
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

-- Application Answers
WITH question_ids AS (
  SELECT id as q_id, job_id, "order"
  FROM job_questions
  WHERE job_id IN ('a1b2c3d4-e5f6-4789-a012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'c3d4e5f6-a7b8-4901-c234-567890123456', 'd4e5f6a7-b8c9-4012-d345-678901234567')
),
answer_data AS (
  SELECT * FROM (VALUES
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 1, '3-5 years'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 2, 'Yes'),
    ('f6a7b8c9-d0e1-4234-f567-890123456789', 'a1b2c3d4-e5f6-4789-a012-345678901234', 3, 'I have been using ELDs for the past 4 years and am very comfortable with all features including HOS tracking and DVIR.'),
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 1, '5 years'),
    ('b8c9d0e1-f2a3-4456-b789-012345678901', 'c3d4e5f6-a7b8-4901-c234-567890123456', 2, 'Yes, very familiar'),
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 1, '["H - Hazmat"]'),
    ('c9d0e1f2-a3b4-4567-c890-123456789012', 'd4e5f6a7-b8c9-4012-d345-678901234567', 2, '2 years'),
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 1, '5+ years'),
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 2, 'Yes'),
    ('d0e1f2a3-b4c5-4678-d901-234567890123', 'a1b2c3d4-e5f6-4789-a012-345678901234', 3, 'Extensive experience with ELDs, including compliance monitoring and DVIR documentation.'),
    ('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 1, 'Yes'),
    ('e1f2a3b4-c5d6-4789-e012-345678901234', 'b2c3d4e5-f6a7-4890-b123-456789012345', 2, 'Yes')
  ) AS t(application_id, job_id, question_order, answer)
)
INSERT INTO application_answers (application_id, question_id, answer)
SELECT ad.application_id::uuid, qi.q_id, ad.answer
FROM answer_data ad
JOIN question_ids qi ON qi.job_id = ad.job_id::uuid AND qi."order" = ad.question_order
ON CONFLICT (application_id, question_id) DO UPDATE SET answer = EXCLUDED.answer;

-- Address History
DELETE FROM address_history WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES ('81d919d7-f558-4d84-bced-e9659828c08e', '123 Main Street', 'Springfield', 'IL', '62701', '2021-01-01', NULL);

DELETE FROM address_history WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', '456 Oak Avenue', 'Chicago', 'IL', '60601', '2022-01-01', NULL),
('8406cf66-046d-452d-800c-a6d7a914579f', '789 Pine Street', 'Springfield', 'IL', '62701', '2020-06-01', '2021-12-31'),
('8406cf66-046d-452d-800c-a6d7a914579f', '321 Elm Drive', 'Peoria', 'IL', '61601', '2018-01-01', '2020-05-31');

DELETE FROM address_history WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';
INSERT INTO address_history (user_id, street, city, state, zip, start_date, end_date)
VALUES
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', '789 Professional Drive', 'Aurora', 'IL', '60505', '2021-03-01', NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', '654 Business Blvd', 'Naperville', 'IL', '60540', '2019-05-15', '2021-02-28'),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', '321 Career Court', 'Joliet', 'IL', '60435', '2017-01-01', '2019-05-14');

-- Employment History
DELETE FROM employment_history WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES ('81d919d7-f558-4d84-bced-e9659828c08e', 'Quick Transport', '150 Truck Lane', 'Springfield', 'IL', '62701', 'Jim Boss', '555-3001', '2022-06-01', NULL, NULL, true, false);

DELETE FROM employment_history WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 'ABC Logistics', '100 Warehouse Blvd', 'Chicago', 'IL', '60601', 'Mike Supervisor', '555-1001', 'mike@abclogistics.com', '2022-01-15', NULL, NULL, true, false),
('8406cf66-046d-452d-800c-a6d7a914579f', 'XYZ Transport', '200 Trucking Way', 'Springfield', 'IL', '62701', 'Sarah Johnson', '555-1002', 'sarah@xyztransport.com', '2020-03-01', '2021-12-15', 'Better opportunity', true, false),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Long Haul Express', '300 Highway Road', 'Peoria', 'IL', '61601', 'Tom Manager', '555-1003', 'tom@longhaul.com', '2017-01-01', '2020-02-28', 'Company relocation', true, true),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Freight Masters', '400 Cargo Lane', 'Rockford', 'IL', '61101', 'Lisa Director', '555-1004', 'lisa@freightmasters.com', '2015-06-01', '2016-12-31', 'Career advancement', true, true);

DELETE FROM employment_history WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';
INSERT INTO employment_history (user_id, company_name, company_address_street, company_address_city, company_address_state, company_address_zip, supervisor_name, supervisor_phone, supervisor_email, start_date, end_date, reason_for_leaving, cdl_required, is_cdl_employment)
VALUES
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Premium Transport Co', '500 Elite Way', 'Aurora', 'IL', '60505', 'Robert Manager', '555-5001', 'robert@premiumtransport.com', '2021-08-01', NULL, 'New opportunity', true, false),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Regional Freight Lines', '600 Regional Ave', 'Naperville', 'IL', '60540', 'Jennifer Director', '555-5002', 'jennifer@regionalfreight.com', '2019-01-15', '2021-07-31', 'Career growth', true, false),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Cross Country Carriers', '700 Highway Blvd', 'Joliet', 'IL', '60435', 'Michael VP', '555-5003', 'michael@crosscountry.com', '2015-03-01', '2018-12-31', 'Better routes', true, true),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Long Distance Logistics', '800 Miles Road', 'Chicago', 'IL', '60601', 'Patricia Owner', '555-5004', 'patricia@longdist.com', '2012-06-01', '2015-02-28', 'Company acquisition', true, true),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'First Class Freight', '900 Quality St', 'Rockford', 'IL', '61101', 'James Supervisor', '555-5005', 'james@firstclass.com', '2010-01-01', '2012-05-31', 'Expanded opportunities', true, true);

-- Background Questions
DELETE FROM background_questions WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';
INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
('81d919d7-f558-4d84-bced-e9659828c08e', 1, false, NULL),
('81d919d7-f558-4d84-bced-e9659828c08e', 2, false, NULL),
('81d919d7-f558-4d84-bced-e9659828c08e', 3, false, NULL)
ON CONFLICT (user_id, question_number) DO UPDATE SET answer = EXCLUDED.answer, explanation = EXCLUDED.explanation, updated_at = NOW();

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
ON CONFLICT (user_id, question_number) DO UPDATE SET answer = EXCLUDED.answer, explanation = EXCLUDED.explanation, updated_at = NOW();

DELETE FROM background_questions WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';
INSERT INTO background_questions (user_id, question_number, answer, explanation)
VALUES
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 1, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 2, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 3, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 4, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 5, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 6, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 7, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 8, false, NULL),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 9, false, NULL)
ON CONFLICT (user_id, question_number) DO UPDATE SET answer = EXCLUDED.answer, explanation = EXCLUDED.explanation, updated_at = NOW();

-- Emergency Contacts
DELETE FROM emergency_contacts WHERE user_id = '81d919d7-f558-4d84-bced-e9659828c08e';
INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES ('81d919d7-f558-4d84-bced-e9659828c08e', 'Jane Trucker', '123 Main Street', 'Springfield', 'IL', '62701', 'Spouse', '555-4001', 0);

DELETE FROM emergency_contacts WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';
INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 'John Hauler', '456 Oak Avenue', 'Chicago', 'IL', '60601', 'Spouse', '555-2001', 0),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Mary Hauler', '789 Family Lane', 'Chicago', 'IL', '60601', 'Mother', '555-2002', 1),
('8406cf66-046d-452d-800c-a6d7a914579f', 'Robert Friend', '321 Friend Street', 'Springfield', 'IL', '62701', 'Friend', '555-2003', 2);

DELETE FROM emergency_contacts WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';
INSERT INTO emergency_contacts (user_id, full_name, address_street, address_city, address_state, address_zip, relationship, phone, "order")
VALUES
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Susan Professional', '789 Professional Drive', 'Aurora', 'IL', '60505', 'Spouse', '555-6001', 0),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Thomas Professional', '123 Parent Ave', 'Aurora', 'IL', '60505', 'Father', '555-6002', 1),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'Jennifer Colleague', '456 Work Street', 'Naperville', 'IL', '60540', 'Friend', '555-6003', 2);

-- Authorizations
DELETE FROM authorizations WHERE user_id = '8406cf66-046d-452d-800c-a6d7a914579f';
INSERT INTO authorizations (user_id, authorization_type, signed, signed_at)
VALUES
('8406cf66-046d-452d-800c-a6d7a914579f', 'applicant_certification', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'hireright_background', true, NOW() - INTERVAL '30 days'),
('8406cf66-046d-452d-800c-a6d7a914579f', 'psp_authorization', true, NOW() - INTERVAL '30 days')
ON CONFLICT (user_id, authorization_type) DO UPDATE SET signed = EXCLUDED.signed, signed_at = EXCLUDED.signed_at, updated_at = NOW();

DELETE FROM authorizations WHERE user_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b';
INSERT INTO authorizations (user_id, authorization_type, signed, signed_at)
VALUES
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'applicant_certification', true, NOW() - INTERVAL '45 days'),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'fmcsa_clearinghouse', true, NOW() - INTERVAL '45 days'),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'hireright_background', true, NOW() - INTERVAL '45 days'),
('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b', 'psp_authorization', true, NOW() - INTERVAL '45 days')
ON CONFLICT (user_id, authorization_type) DO UPDATE SET signed = EXCLUDED.signed, signed_at = EXCLUDED.signed_at, updated_at = NOW();

COMMIT;

