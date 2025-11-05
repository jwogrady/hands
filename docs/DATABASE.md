# Database Management Guide

This guide explains how to update your database schema and seed data for the Hands driver screening platform.

## Prerequisites

1. **Supabase CLI** installed globally:

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase CLI**:

   ```bash
   supabase login
   ```

   This will open a browser window for authentication. Follow the prompts to complete login.

3. **Project linked** to your hosted Supabase instance:

   ```bash
   supabase link --project-ref ikvxuxcmnszativainob
   ```

   You'll be prompted for your database password. You can find it in your Supabase project settings (Dashboard → Settings → Database).

   **Note**: If you encounter a config parsing error about `'auth' has invalid keys: phone`, ensure the `[auth.phone]` section in `supabase/config.toml` is commented out or removed.

## Updating Database Schema

### Option 1: Apply All Migrations (Recommended)

To apply all pending migrations to your hosted database:

```bash
supabase db push
```

This command will:

- Read all migration files from `supabase/migrations/`
- Apply them in chronological order
- Only run migrations that haven't been applied yet

### Option 2: Apply Migrations Manually

If you need more control, you can apply migrations manually via the Supabase SQL Editor:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ikvxuxcmnszativainob
2. Navigate to **SQL Editor**
3. Copy the contents of each migration file in order:
   - `supabase/migrations/20250101000000_initial_schema.sql`
   - `supabase/migrations/20250102000000_candidate_profile_fields.sql`
4. Run each SQL script in the SQL Editor

## Seeding the Database

### Option 1: Using Supabase SQL Editor (Recommended for Hosted Instances)

This is the easiest method for hosted Supabase instances:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ikvxuxcmnszativainob
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/seed.sql`
4. Paste and run in the SQL Editor

**Note**: This method is safer than resetting because it won't drop existing data (the seed file uses idempotent `ON CONFLICT` clauses).

### Option 2: Using Supabase CLI

If you want to reset and reseed (⚠️ **WARNING**: This drops all data):

```bash
supabase db reset
```

**⚠️ WARNING**: This will:

- Drop all existing data
- Re-apply all migrations
- Run the seed file

If you want to seed without resetting, you can run the seed file directly using psql:

```bash
# Get your database connection string
supabase db remote-url

# Then run the seed file (replace [YOUR-CONNECTION-STRING] with the output above)
psql "[YOUR-CONNECTION-STRING]" -f supabase/seed.sql
```

## Seed Data Overview

The seed file (`supabase/seed.sql`) includes:

1. **Manager Account**: `john@status26.com` (John Manager)
2. **Candidate 1 - No Profile**: `alice@hands.test` (Alice Driver)
3. **Candidate 2 - Partial Profile**: `bob@hands.test` (Bob Trucker)
4. **Candidate 3 - Complete Profile**: `carol@hands.test` (Carol Hauler)
5. **Candidate 4 - Hired**: `david@hands.test` (David Professional)

**⚠️ Important**: The seed file requires these users to exist in `auth.users` before running. If you haven't created them yet:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Create users with the following emails:
   - `alice@hands.test`
   - `bob@hands.test`
   - `carol@hands.test`
   - `david@hands.test`

Or use the Supabase Auth API to create them programmatically.

## Migration Files

- `20250101000000_initial_schema.sql`: Initial schema (profiles, jobs, applications, etc.)
- `20250102000000_candidate_profile_fields.sql`: Extended candidate profile fields (address history, employment history, etc.)

## Verifying Your Setup

After applying migrations and seeding:

1. **Check Tables**: Go to Supabase Dashboard → **Table Editor** to verify all tables exist
2. **Check Seed Data**: Verify you see test data in the tables
3. **Check RLS Policies**: Ensure Row Level Security policies are active

## Troubleshooting

### Migration Already Applied

If you see errors about migrations already being applied, you can:

1. Check migration status:

   ```bash
   supabase migration list
   ```

2. If needed, manually mark migrations as applied in the `supabase_migrations.schema_migrations` table

### Seed Data Conflicts

The seed file is idempotent and uses `ON CONFLICT` clauses. If you encounter issues:

1. Check for foreign key constraints
2. Ensure all required users exist in `auth.users`
3. Review the seed file comments for specific requirements

### Config File Issues

If you see an error like `'auth' has invalid keys: phone`:

1. Open `supabase/config.toml`
2. Comment out or remove the `[auth.phone]` section (lines 93-96)
3. The config should work with your Supabase CLI version

### Connection Issues

If you have trouble connecting:

1. Verify your project reference: `ikvxuxcmnszativainob`
2. Check your database password in Supabase Dashboard → Settings → Database
3. Ensure your IP is allowed in Database settings → Connection Pooling
4. Make sure you've run `supabase login` before linking

### Authentication Issues

If you get "Access token not provided" errors:

1. Run `supabase login` to authenticate
2. Follow the browser prompts to complete authentication
3. Then retry your command

## Quick Reference

### Complete Setup Workflow

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref ikvxuxcmnszativainob

# 4. Push migrations
supabase db push

# 5. Seed data (via SQL Editor recommended, or use psql)
# Option A: Use Supabase Dashboard SQL Editor (recommended)
# Option B: Use psql with connection string
supabase db remote-url
psql "[CONNECTION-STRING]" -f supabase/seed.sql
```

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in a development environment first
3. **Review SQL** before applying to production
4. **Use transactions** - migrations are wrapped in transactions for safety
5. **Keep migrations small** - one logical change per migration file
6. **Use SQL Editor for seeding** on hosted instances (safer than reset)
7. **Verify seed data** after running to ensure all test cases are present
