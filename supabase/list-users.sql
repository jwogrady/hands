-- List all test users with their UUIDs and emails
-- Run this after creating users to get the actual UUIDs

SELECT 
  id,
  email,
  CASE 
    WHEN email = 'john@status26.com' THEN 'Manager (John)'
    WHEN email = 'alice@hands.test' THEN 'Candidate - No Profile (Alice)'
    WHEN email = 'bob@hands.test' THEN 'Candidate - Partial Profile (Bob)'
    WHEN email = 'carol@hands.test' THEN 'Candidate - Complete Profile (Carol)'
    WHEN email = 'david@hands.test' THEN 'Candidate - Hired (David)'
    ELSE 'Unknown'
  END as user_type,
  created_at
FROM auth.users 
WHERE email IN (
  'john@status26.com',
  'alice@hands.test',
  'bob@hands.test',
  'carol@hands.test',
  'david@hands.test'
)
ORDER BY 
  CASE email
    WHEN 'john@status26.com' THEN 1
    WHEN 'alice@hands.test' THEN 2
    WHEN 'bob@hands.test' THEN 3
    WHEN 'carol@hands.test' THEN 4
    WHEN 'david@hands.test' THEN 5
  END;

-- Alternative: Get as JSON array for easy copy-paste
SELECT json_agg(
  json_build_object(
    'email', email,
    'id', id,
    'type', CASE 
      WHEN email = 'john@status26.com' THEN 'Manager'
      WHEN email = 'alice@hands.test' THEN 'No Profile'
      WHEN email = 'bob@hands.test' THEN 'Partial Profile'
      WHEN email = 'carol@hands.test' THEN 'Complete Profile'
      WHEN email = 'david@hands.test' THEN 'Hired'
    END
  )
) as users_json
FROM auth.users 
WHERE email IN (
  'john@status26.com',
  'alice@hands.test',
  'bob@hands.test',
  'carol@hands.test',
  'david@hands.test'
);

