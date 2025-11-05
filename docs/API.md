# API Documentation

## Supabase Client

The application uses Supabase as the backend service. All API interactions are handled through the Supabase client.

### Client Initialization

The Supabase client is initialized in `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Database Schema

### Tables

The database schema will be defined in Supabase migrations. Key tables include:

- `profiles` - User profile information
- `jobs` - Job postings
- `applications` - Candidate applications
- `employment_history` - Employment records
- `documents` - Uploaded file metadata
- `background_questions` - Background check responses
- `emergency_contacts` - Emergency contact information

_Note: Full schema documentation will be added as migrations are created._

## Authentication

Authentication is handled through Supabase Auth.

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
})
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User

```typescript
const {
  data: { user },
} = await supabase.auth.getUser()
```

## Storage

File uploads are handled through Supabase Storage.

### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .upload('resumes/user-id/resume.pdf', file)
```

### Download File

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .getPublicUrl('resumes/user-id/resume.pdf')
```

## Row Level Security (RLS)

All database tables use Row Level Security policies to control access:

- **Candidates**: Can only access their own data
- **Managers**: Can access all candidate and application data
- **Public**: Limited read access for job listings

_Note: RLS policies will be documented as they are implemented._

## Error Handling

All Supabase operations return an error object that should be checked:

```typescript
const { data, error } = await supabase.from('table').select()

if (error) {
  console.error('Error:', error.message)
  // Handle error
}
```

## TypeScript Types

TypeScript types are generated from the Supabase schema:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
```

_Note: Types will be generated and documented as the schema is developed._
