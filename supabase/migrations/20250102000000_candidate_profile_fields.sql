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
  ADD COLUMN IF NOT EXISTS driving_experience_equipment JSONB, -- Array of equipment types
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
  is_cdl_employment BOOLEAN DEFAULT FALSE, -- For 7-year CDL history
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
  file_path TEXT NOT NULL, -- Path in Supabase Storage
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_address_history_user_id ON address_history(user_id);
CREATE INDEX IF NOT EXISTS idx_employment_history_user_id ON employment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_employment_history_cdl ON employment_history(user_id, is_cdl_employment);
CREATE INDEX IF NOT EXISTS idx_background_questions_user_id ON background_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_authorizations_user_id ON authorizations(user_id);

-- Enable RLS
ALTER TABLE address_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for address_history
CREATE POLICY "Users can manage own address history"
  ON address_history FOR ALL
  USING (auth.uid() = user_id);

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
CREATE POLICY "Users can manage own employment history"
  ON employment_history FOR ALL
  USING (auth.uid() = user_id);

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
CREATE POLICY "Users can manage own background questions"
  ON background_questions FOR ALL
  USING (auth.uid() = user_id);

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
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts FOR ALL
  USING (auth.uid() = user_id);

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
CREATE POLICY "Users can manage own documents"
  ON documents FOR ALL
  USING (auth.uid() = user_id);

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
CREATE POLICY "Users can manage own authorizations"
  ON authorizations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view authorizations"
  ON authorizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

