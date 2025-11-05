# Architecture Documentation

## System Overview

Hands is a driver screening and onboarding platform built with a modern web stack. The system enables managers to post job listings and review candidates, while candidates can register, complete profiles, and apply for positions.

## Technology Stack

### Frontend

- **React 18** - UI library
- **TanStack Router** - Routing and navigation
- **TanStack Query** - Server state management
- **TanStack UI** - Component library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Auth)
  - Storage (file uploads)
  - Row Level Security (RLS)
  - Edge Functions (optional)

### Infrastructure

- **Netlify** - Hosting and deployment
- **GitHub Actions** - CI/CD pipeline

## Architecture Patterns

### Feature-Based Organization

The codebase is organized by features rather than file types:

\`\`\`
src/features/
├── auth/
│ ├── components/
│ ├── hooks/
│ ├── types.ts
│ └── index.ts
├── jobs/
├── applications/
└── candidates/
\`\`\`

Each feature module is self-contained with its own components, hooks, types, and utilities.

### Data Flow

1. **User Interaction** → React Component
2. **Component** → TanStack Query Hook
3. **Query Hook** → Supabase Client
4. **Supabase** → PostgreSQL Database
5. **Response** flows back through the chain

### Authentication Flow

1. User signs in/up via Supabase Auth
2. Supabase returns JWT token
3. Token stored in browser (localStorage/sessionStorage)
4. Token included in all subsequent API requests
5. RLS policies enforce data access permissions

## Database Schema

### Core Tables

#### Users (Supabase Auth)

- Managed by Supabase Auth
- Extended with user profiles table

#### Profiles

- User profile information
- Personal details, contact info, CDL information

#### Jobs

- Job postings created by managers
- Job-specific questions and requirements

#### Applications

- Candidate applications for jobs
- Links candidates to jobs
- Stores application status

#### Employment History

- Employment records for candidates
- Last 3 years + 7 years for CDL employers
- Verification status

#### Documents

- Uploaded files (resumes, licenses, certifications)
- Stored in Supabase Storage
- Metadata in database

#### Background Questions

- 9 standard background check questions
- Yes/no answers with details

#### Emergency Contacts

- Emergency contact information
- Up to 3 contacts per candidate

### Row Level Security (RLS)

RLS policies enforce data access:

- **Candidates**: Can only view/edit their own data
- **Managers**: Can view all candidates and applications
- **Public**: Limited read access for job listings

## PDF Generation

PDF packets are generated on-demand when managers review applications. The PDF includes:

1. Personal Information
2. Driving Experience
3. Employment History (3 years + 7 years CDL)
4. Background Questions
5. Emergency Contacts
6. Authorizations & Releases
7. Uploaded Documents

**Implementation Options**:

- Client-side: `pdf-lib` or `@react-pdf/renderer`
- Server-side: Supabase Edge Function with `pdfkit` or `puppeteer`

Generated PDFs are stored in Supabase Storage for HR access.

## Security Considerations

### Data Protection

- All sensitive data encrypted at rest (Supabase)
- HTTPS for all communications
- JWT tokens for authentication
- RLS policies for data access control

### Compliance

- FMCSA regulations (49 CFR 391.23, 382.701)
- DOT drug and alcohol screening requirements
- Data retention policies
- Audit trails for compliance

### Input Validation

- Client-side validation for UX
- Server-side validation via RLS and database constraints
- File upload restrictions (size, type)

## Deployment Architecture

### Environments

1. **Development**: Local development with Supabase CLI
2. **Staging**: Preview deployments on Netlify (branch deploys)
3. **Production**: Main branch deployments to Netlify

### CI/CD Pipeline

1. **On PR**: Lint, type-check, test, build
2. **On Merge to Develop**: Deploy to staging preview
3. **On Merge to Main**: Deploy to production

### Environment Variables

- Managed in Netlify dashboard for production
- `.env.local` for local development
- `.env.example` as template

## Performance Considerations

- **Code Splitting**: Vite automatically splits code by route
- **Image Optimization**: Optimize images before upload
- **Caching**: Supabase CDN for static assets
- **Database Indexing**: Proper indexes on frequently queried columns
- **Query Optimization**: Use TanStack Query for efficient data fetching

## Monitoring & Observability

- **Error Tracking**: Sentry (recommended)
- **Analytics**: Netlify Analytics
- **Logs**: Supabase logs for backend issues
- **Performance**: Vite build analysis, Lighthouse audits

## Future Considerations

- **Edge Functions**: Move heavy processing to Supabase Edge Functions
- **Caching Layer**: Redis for frequently accessed data
- **Background Jobs**: Handle PDF generation asynchronously
- **Real-time Updates**: Supabase Realtime for live application status
- **Mobile App**: React Native or PWA for mobile access

## Key Decisions

1. **Supabase over custom backend**: Faster development, built-in auth, RLS
2. **TanStack Router**: Type-safe routing, better DX than React Router
3. **Feature-based structure**: Easier to scale and maintain
4. **TypeScript**: Type safety reduces bugs, improves DX
5. **Vite**: Faster dev server and builds compared to Create React App
