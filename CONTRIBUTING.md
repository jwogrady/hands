# Contributing to Hands

Thank you for your interest in contributing to Hands! This document provides guidelines and instructions for contributing.

## Development Setup

See [README.md](./README.md) for detailed setup instructions.

## Documentation

- **[docs/README.md](./docs/README.md)** - Documentation index
- **[docs/OVERVIEW.md](./docs/OVERVIEW.md)** - Business requirements and user workflows
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture

## Git Workflow

### Branch Strategy

We use a Git Flow variant:

- \`main\` - Production-ready code
- \`develop\` - Integration branch for completed features
- \`feature/\*\` - Feature branches
- \`bugfix/\*\` - Bug fixes targeting develop
- \`hotfix/\*\` - Critical production fixes

### Branch Naming

- Features: \`feature/M1-job-posting-interface\`
- Bugs: \`bugfix/fix-upload-validation\`
- Hotfixes: \`hotfix/critical-auth-bug\`

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages. This enables automated versioning, changelog generation, and release management via Release Please.

#### Commit Message Format

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

#### Types

- **\`feat:\`** - A new feature
- **\`fix:\`** - A bug fix
- **\`docs:\`** - Documentation only changes
- **\`style:\`** - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **\`refactor:\`** - A code change that neither fixes a bug nor adds a feature
- **\`perf:\`** - A code change that improves performance
- **\`test:\`** - Adding missing tests or correcting existing tests
- **\`build:\`** - Changes that affect the build system or external dependencies (example scopes: npm, vite, netlify)
- **\`ci:\`** - Changes to CI configuration files and scripts (example scopes: github-actions, workflows)
- **\`chore:\`** - Other changes that don't modify src or test files
- **\`revert:\`** - Reverts a previous commit

#### Scopes (Optional)

Scopes help contextualize the commit. Common scopes include:

- \`auth\` - Authentication related
- \`jobs\` - Job posting features
- \`applications\` - Application workflow
- \`candidates\` - Candidate management
- \`pdf\` - PDF generation
- \`ui\` - UI components
- \`api\` - API changes
- \`db\` - Database/migrations
- \`deps\` - Dependencies

#### Examples

**Simple commit:**
\`\`\`
feat: add job posting form for managers
\`\`\`

**Commit with scope:**
\`\`\`
feat(jobs): add job posting form for managers
\`\`\`

**Commit with breaking change:**
\`\`\`
feat(api): change application status enum values

BREAKING CHANGE: Application status values changed from lowercase to uppercase
\`\`\`

**Commit with body:**
\`\`\`
fix(auth): prevent duplicate email registrations

Add validation to check for existing emails before creating new user accounts.
This prevents duplicate registrations and improves data integrity.

Closes #123
\`\`\`

**More examples:**

- \`fix(candidates): correct SSN validation regex\`
- \`docs(api): update API documentation\`
- \`refactor(ui): extract common form components\`
- \`test(applications): add unit tests for application workflow\`
- \`chore(deps): update dependencies to latest versions\`
- \`ci(workflows): add release-please workflow\`

#### Breaking Changes

If your commit includes a breaking change, add \`BREAKING CHANGE:\` in the footer:

\`\`\`
feat(api): restructure authentication endpoints

BREAKING CHANGE: Authentication endpoints now require API version prefix (/api/v1/auth)
\`\`\`

#### Release Please Integration

Release Please automatically:

- Monitors commits for Conventional Commits format
- Generates \`CHANGELOG.md\` with categorized changes
- Creates release PRs with version bumps
- Manages semantic versioning (major.minor.patch)

**Version bumps:**

- \`feat:\` commits → minor version bump
- \`fix:\` commits → patch version bump
- \`feat!\` or \`BREAKING CHANGE:\` → major version bump

## Development Process

### 1. Create a Feature Branch

\`\`\`bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
\`\`\`

### 2. Make Your Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### 3. Write Tests

- Add unit tests for new features
- Update existing tests if behavior changes
- Aim for 70%+ code coverage
- Ensure all tests pass before committing

### 4. Run Quality Checks

Before committing, ensure:

\`\`\`bash
npm run lint # No linting errors
npm run type-check # No type errors
npm run format:check # Code is formatted
npm run test # All tests pass
\`\`\`

### 5. Commit Your Changes

Use Conventional Commits format for your commit message:

\`\`\`bash
git add .
git commit -m "feat(jobs): add job posting form for managers"
\`\`\`

**Important**: Commit messages must follow the [Conventional Commits](#commit-messages) format for Release Please to work correctly.

Pre-commit hooks will automatically:

- Run lint-staged (lint and format staged files)
- Check for common issues

**Note**: Commit message format is not enforced by hooks, but must be followed manually for proper release automation.

### 6. Push and Create Pull Request

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

Then create a pull request to \`develop\` using the PR template.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid \`any\` types - use proper types or \`unknown\`
- Prefer interfaces for object shapes
- Use type inference where possible

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

### File Organization

- One component per file
- Export components as default
- Use index files for clean imports
- Group related files in feature folders

### Naming Conventions

- **Components**: PascalCase (\`JobPostingForm.tsx\`)
- **Hooks**: camelCase with "use" prefix (\`useJobApplications.ts\`)
- **Utilities**: camelCase (\`formatDate.ts\`)
- **Types/Interfaces**: PascalCase (\`ApplicationStatus\`)
- **Constants**: UPPER_SNAKE_CASE (\`MAX_FILE_SIZE\`)

## Testing Guidelines

### Unit Tests

- Test component rendering
- Test user interactions
- Test business logic
- Test edge cases and error handling

### Integration Tests

- Test feature workflows
- Test API interactions (with mocks)
- Test form submissions

### E2E Tests

- Test critical user flows
- Test authentication flows
- Test application submission process

## Pull Request Process

1. **Fill out PR template** completely
2. **Link related issues** if applicable
3. **Ensure CI passes** - all checks must be green
4. **Request review** from team members
5. **Address feedback** promptly
6. **Squash commits** when merging (if requested)

### PR Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] No console.logs or debug code
- [ ] No commented-out code
- [ ] TypeScript types are correct
- [ ] No security vulnerabilities introduced

## Database Changes

### Migrations

- All database changes must be in migrations
- Use timestamp format: \`YYYYMMDDHHMMSS_description.sql\`
- Test migrations locally before committing
- Include both up and down migrations if needed

### Schema Changes

- Update TypeScript types to match schema
- Update RLS policies if needed
- Document breaking changes

## Documentation

- Update README.md if setup process changes
- Update ARCHITECTURE.md for architectural changes
- Add JSDoc comments for public APIs
- Update inline comments for complex logic

## Questions?

If you have questions or need help:

1. Check existing documentation
2. Search existing issues/PRs
3. Ask in team chat or create an issue

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Provide constructive feedback
- Focus on what's best for the project

Thank you for contributing to Hands!
