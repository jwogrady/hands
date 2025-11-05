-- Verification queries to check if all required users exist before seeding
-- Run these queries in Supabase SQL Editor before running complete-seed.sql

-- 1. Check if all required users exist in auth.users
SELECT 
  id, 
  email,
  CASE 
    WHEN id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' THEN 'Manager (John)'
    WHEN id = 'bfe9d5cd-8eca-4c82-83ee-dc0689844750' THEN 'Candidate - No Profile (Alice)'
    WHEN id = '81d919d7-f558-4d84-bced-e9659828c08e' THEN 'Candidate - Partial Profile (Bob)'
    WHEN id = '8406cf66-046d-452d-800c-a6d7a914579f' THEN 'Candidate - Complete Profile (Carol)'
    WHEN id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b' THEN 'Candidate - Hired (David)'
    ELSE 'Unknown'
  END as user_type
FROM auth.users 
WHERE id IN (
  'df0e04a4-4b3c-4666-9a68-a78f1d67f15f',
  'bfe9d5cd-8eca-4c82-83ee-dc0689844750',
  '81d919d7-f558-4d84-bced-e9659828c08e',
  '8406cf66-046d-452d-800c-a6d7a914579f',
  'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b'
)
ORDER BY id;

-- 2. Check which users are missing (should return 0 rows if all exist)
SELECT 
  required_id::uuid as missing_user_id,
  CASE 
    WHEN required_id = 'df0e04a4-4b3c-4666-9a68-a78f1d67f15f' THEN 'john@status26.com - Manager'
    WHEN required_id = 'bfe9d5cd-8eca-4c82-83ee-dc0689844750' THEN 'alice@hands.test - Candidate (No Profile)'
    WHEN required_id = '81d919d7-f558-4d84-bced-e9659828c08e' THEN 'bob@hands.test - Candidate (Partial Profile)'
    WHEN required_id = '8406cf66-046d-452d-800c-a6d7a914579f' THEN 'carol@hands.test - Candidate (Complete Profile)'
    WHEN required_id = 'e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b' THEN 'david@hands.test - Candidate (Hired)'
  END as details
FROM (
  VALUES 
    ('df0e04a4-4b3c-4666-9a68-a78f1d67f15f'),
    ('bfe9d5cd-8eca-4c82-83ee-dc0689844750'),
    ('81d919d7-f558-4d84-bced-e9659828c08e'),
    ('8406cf66-046d-452d-800c-a6d7a914579f'),
    ('e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b')
) AS required(required_id)
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = required_id::uuid
);

-- 3. Verify foreign key constraint on applications.candidate_id
SELECT
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'applications'
  AND kcu.column_name = 'candidate_id';

-- 4. Check data types match between auth.users.id and applications.candidate_id
SELECT 
  'auth.users.id' as column_ref,
  column_name, 
  data_type, 
  udt_name 
FROM information_schema.columns
WHERE table_schema = 'auth' 
  AND table_name = 'users' 
  AND column_name = 'id'
UNION ALL
SELECT 
  'applications.candidate_id' as column_ref,
  column_name, 
  data_type, 
  udt_name 
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'applications' 
  AND column_name = 'candidate_id';

