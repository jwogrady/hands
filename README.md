# Hands - Driver Screening Platform

[![GitHub](https://img.shields.io/github/repo-size/jwogrady/hands)](https://github.com/jwogrady/hands)
[![GitHub](https://img.shields.io/github/last-commit/jwogrady/hands)](https://github.com/jwogrady/hands)

Hands is an API and web app designed to simplify the driver screening and on-boarding process. For the MVP, we use Supabase to create a seamless registration and job application workflow, allowing candidates to register, complete their profiles, and apply for jobs.

**Repository**: [github.com/jwogrady/hands](https://github.com/jwogrady/hands)

## Tech Stack

- **Frontend**: React + TanStack UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Netlify
- **Build Tool**: Vite
- **Language**: TypeScript

## Features

- **Manager Features**:
  - Post job ads
  - View candidate and application dashboards
  - Manually review applications
  - Generate PDF packets for HR processing

- **Candidate Features**:
  - Register and complete profiles
  - Apply for jobs
  - Upload documents (resumes, licenses)
  - Track application status
  - Answer dynamic job-specific questions

## Prerequisites

- Node.js 20+ and npm
- Git
- Supabase account (for production) or Supabase CLI (for local development)

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone git@github.com:jwogrady/hands.git
cd hands
\`\`\`

Or using HTTPS:

\`\`\`bash
git clone https://github.com/jwogrady/hands.git
cd hands
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:3000
\`\`\`

### 4. Set Up Supabase (Local Development)

\`\`\`bash

# Install Supabase CLI (if not already installed)

npm install -g supabase

# Start local Supabase instance

supabase start

# Run migrations

supabase db reset
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run lint:fix\` - Fix ESLint errors automatically
- \`npm run format\` - Format code with Prettier
- \`npm run format:check\` - Check code formatting
- \`npm run test\` - Run unit tests
- \`npm run test:watch\` - Run tests in watch mode
- \`npm run test:coverage\` - Run tests with coverage report
- \`npm run test:e2e\` - Run end-to-end tests
- \`npm run test:e2e:ui\` - Run E2E tests with UI
- \`npm run type-check\` - Run TypeScript type checking

## Project Structure

\`\`\`
hands/
├── .github/
│ ├── workflows/ # CI/CD workflows
│ └── pull_request_template.md
├── .vscode/ # Editor configs
├── docs/ # Documentation
│ ├── README.md # Documentation index
│ ├── OVERVIEW.md # Business goals, workflows, user experiences
│ ├── ARCHITECTURE.md # Technical architecture
│ ├── API.md # API documentation
│ └── DEPLOYMENT.md # Deployment guide
├── e2e/ # E2E tests
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI components
│ ├── features/ # Feature-based modules
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utilities, Supabase client
│ ├── types/ # TypeScript types/interfaces
│ ├── **tests**/ # Unit tests
│ ├── app.tsx # Main app entry
│ └── main.tsx # App bootstrap
├── supabase/
│ ├── migrations/ # Database migrations
│ ├── functions/ # Edge functions
│ ├── config.toml # Supabase config
│ └── seed.sql # Seed data
├── .env.example # Environment variable template
├── .gitignore
├── CONTRIBUTING.md # Contribution guidelines
├── netlify.toml # Netlify configuration
├── package.json
├── README.md # This file
├── tsconfig.json
└── vite.config.ts
\`\`\`

## Development Workflow

1. Create a feature branch from \`develop\`
2. Make your changes
3. Run tests and linting: \`npm run test && npm run lint\`
4. Commit your changes (conventional commits recommended)
5. Push and create a pull request to \`develop\`
6. After review, merge to \`develop\`
7. Deploy to staging (automatic via Netlify)
8. Merge \`develop\` to \`main\` for production deployment

## Database Migrations

Migrations are stored in \`supabase/migrations/\` with timestamp format:
\`YYYYMMDDHHMMSS_description.sql\`

To create a new migration:
\`\`\`bash
supabase migration new migration_name
\`\`\`

To apply migrations:
\`\`\`bash
supabase db reset # Local development
\`\`\`

## Testing

- **Unit Tests**: Jest + React Testing Library (\`src/**tests**/\`)
- **E2E Tests**: Playwright (\`e2e/\`)
- Target coverage: 70%+ for business logic

## Release Process

We use [Release Please](https://github.com/googleapis/release-please) for automated versioning and changelog generation:

- **Conventional Commits**: All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- **Automatic Versioning**: Release Please automatically bumps versions based on commit types
- **Changelog Generation**: CHANGELOG.md is automatically updated with categorized changes
- **Release PRs**: Release Please creates PRs with version bumps and changelog updates

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed commit message guidelines.

## Deployment

Production deployments are handled automatically via Netlify when code is merged to \`main\`. Branch previews are created for pull requests.

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[docs/README.md](./docs/README.md)** - Documentation index and navigation
- **[docs/OVERVIEW.md](./docs/OVERVIEW.md)** - Business goals, user experiences, workflows, and milestones
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture and system design
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines and contribution process

## License

[Add license information]
