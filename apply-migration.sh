#!/bin/bash
# Script to apply the second migration using Supabase CLI

echo "Applying migration 20250102000000_candidate_profile_fields.sql..."

# First, mark the first migration as applied (since it already exists)
echo "Marking first migration as applied..."
supabase db execute --sql "
  INSERT INTO supabase_migrations.schema_migrations (version, name) 
  VALUES ('20250101000000', 'initial_schema')
  ON CONFLICT (version) DO NOTHING;
" || echo "Note: Migration tracking may already exist"

# Now push the second migration
echo "Pushing second migration..."
supabase db push --include-all

echo "Done! Migration applied."

