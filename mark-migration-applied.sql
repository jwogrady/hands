-- Mark the first migration as applied (since tables already exist)
-- Run this in Supabase SQL Editor first

INSERT INTO supabase_migrations.schema_migrations (version, name) 
VALUES ('20250101000000', 'initial_schema')
ON CONFLICT (version) DO NOTHING;

