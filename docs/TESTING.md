# Testing Strategy

This document outlines the comprehensive testing strategy for the Hands Driver Screening Platform.

## Overview

We use a multi-layered testing approach to ensure code quality, reliability, and maintainability:

- **Unit Tests** - Test individual components and functions in isolation
- **Integration Tests** - Test feature workflows and API interactions
- **End-to-End (E2E) Tests** - Test critical user flows from start to finish
- **Visual Regression Tests** - Ensure UI consistency (future consideration)

## Testing Tools

### Unit & Integration Tests

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - DOM matchers

### E2E Tests

- **Playwright** - Browser automation and E2E testing

### Coverage Tools

- **Jest Coverage** - Built-in coverage reporting
- **Target**: 70%+ coverage for business logic

## Test Structure

```
hands/
├── src/
│   ├── __tests__/           # Unit tests co-located with source
│   │   ├── components/      # Component tests
│   │   ├── features/        # Feature tests
│   │   ├── hooks/           # Hook tests
│   │   ├── lib/             # Utility and API tests
│   │   └── ...
│   └── jest-setup.ts        # Jest configuration
├── e2e/                     # E2E tests
│   ├── auth.spec.ts         # Authentication flows
│   ├── candidate.spec.ts    # Candidate workflows
│   ├── manager.spec.ts      # Manager workflows
│   └── ...
└── jest.config.js           # Jest configuration
```

## Unit Testing Guidelines

### Component Testing

**What to Test:**

- Component renders correctly
- User interactions (clicks, form inputs, etc.)
- Conditional rendering
- Error states
- Loading states
- Props validation

**Example:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginPage } from '../features/auth/pages/LoginPage'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginPage />)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### Hook Testing

**What to Test:**

- Hook returns expected values
- State updates correctly
- Side effects execute properly
- Error handling

**Example:**

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

describe('useAuth', () => {
  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
  })
})
```

### API/Utility Testing

**What to Test:**

- Function returns correct values
- Error handling
- Edge cases
- Input validation

**Example:**

```typescript
import { getProfile } from '../lib/api/profile'
import { supabase } from '../lib/supabase'

jest.mock('../lib/supabase')

describe('getProfile', () => {
  it('fetches profile successfully', async () => {
    const mockProfile = { id: '123', email: 'test@example.com' }
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      }),
    })

    const result = await getProfile('123')
    expect(result).toEqual(mockProfile)
  })
})
```

## Integration Testing

### Feature Workflows

**What to Test:**

- Multi-step processes (profile creation, application submission)
- Form submissions with validation
- API interactions with mocked responses
- Navigation flows

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { ProfileCreationPage } from '../features/profile/pages/ProfileCreationPage'

describe('Profile Creation Flow', () => {
  it('allows user to complete multi-step profile', async () => {
    render(<ProfileCreationPage />)

    // Step 1: Personal Information
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.click(screen.getByText(/next/i))

    // Step 2: Address
    expect(screen.getByText(/present address/i)).toBeInTheDocument()
    // ... continue through steps
  })
})
```

## End-to-End Testing

### Test Coverage

**Critical User Flows to Test:**

1. **Authentication**
   - User registration
   - User login
   - User logout
   - Password reset (if implemented)

2. **Candidate Workflows**
   - Profile creation (all steps)
   - Employment history entry
   - Background questions completion
   - Document upload
   - Emergency contacts
   - Authorization signing
   - Job browsing
   - Job application submission
   - Application status tracking

3. **Manager Workflows**
   - Job posting creation
   - Job posting editing
   - Job question management
   - Candidate dashboard viewing
   - Application review
   - Application approval/rejection
   - PDF generation (when implemented)

### E2E Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Candidate Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as candidate
    await page.goto('/login')
    await page.fill('[name="email"]', 'candidate@test.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should complete profile and apply for job', async ({ page }) => {
    // Navigate to profile creation
    await page.goto('/profile/create')

    // Complete profile steps
    await page.fill('[name="full_name"]', 'John Doe')
    await page.fill('[name="ssn"]', '123-45-6789')
    // ... complete all steps

    // Navigate to jobs
    await page.goto('/jobs')
    await page.click('text=Apply Now')

    // Complete application
    await page.fill('[name="answer_1"]', 'Answer to question')
    await page.click('button:has-text("Submit Application")')

    // Verify success
    await expect(page.locator('text=Application submitted successfully')).toBeVisible()
  })
})
```

## Test Coverage Goals

### Overall Coverage

- **Target**: 70%+ code coverage
- **Critical paths**: 90%+ coverage
- **Business logic**: 80%+ coverage

### Coverage Breakdown by Area

| Area           | Target Coverage |
| -------------- | --------------- |
| Components     | 70%+            |
| Hooks          | 80%+            |
| API/Utilities  | 90%+            |
| Business Logic | 90%+            |
| UI Components  | 60%+            |

### Files to Exclude from Coverage

- `src/main.tsx` - App bootstrap
- `src/vite-env.d.ts` - Type definitions
- `*.d.ts` - Type definition files
- Test files themselves

## Running Tests

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for specific file
npm run test ProfileCreationPage.test.tsx
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npm run test:e2e e2e/auth.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

### CI/CD Integration

Tests run automatically on:

- **Pull Requests** - All tests must pass
- **Main branch** - All tests + coverage checks
- **Pre-commit hooks** - Linting and type checking

## Test Data Management

### Unit Tests

- Use factories/fixtures for test data
- Mock external dependencies (Supabase, API calls)
- Use test databases for integration tests

### E2E Tests

- Use seed data from `supabase/seed.sql`
- Create test users for different roles
- Clean up test data after tests
- Use isolated test data per test run

### Test Users

From seed data:

- `john@status26.com` - Manager
- `alice@hands.test` - Candidate
- `bob@hands.test` - Candidate
- `carol@hands.test` - Candidate

## Mocking Strategy

### Supabase Client

```typescript
// Mock Supabase client for unit tests
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
    },
    storage: {
      from: jest.fn(),
    },
  },
}))
```

### API Responses

```typescript
// Mock API responses
const mockProfile = {
  id: '123',
  email: 'test@example.com',
  full_name: 'Test User',
}

jest.mock('../lib/api/profile', () => ({
  getProfile: jest.fn().mockResolvedValue(mockProfile),
}))
```

## Best Practices

### 1. Test Behavior, Not Implementation

- Test what users see and do
- Avoid testing implementation details
- Focus on user-facing functionality

### 2. Use Descriptive Test Names

```typescript
// Good
it('displays error message when email is invalid', () => {})

// Bad
it('test email validation', () => {})
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('should update profile successfully', async () => {
  // Arrange
  const profile = { id: '123', email: 'test@example.com' }
  const updates = { full_name: 'New Name' }

  // Act
  const result = await updateProfile(profile.id, updates)

  // Assert
  expect(result?.full_name).toBe('New Name')
})
```

### 4. Test Edge Cases

- Empty inputs
- Invalid inputs
- Network errors
- Loading states
- Error states

### 5. Keep Tests Independent

- Each test should be able to run in isolation
- Don't rely on test execution order
- Clean up after each test

### 6. Use Appropriate Queries

```typescript
// Prefer accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByText(/welcome/i)

// Avoid if possible
screen.getByTestId('submit-button')
screen.getByClassName('btn-primary')
```

### 7. Async Testing

```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

// Use findBy queries for async elements
const message = await screen.findByText(/success/i)
expect(message).toBeInTheDocument()
```

## Test Maintenance

### Regular Tasks

- Review and update tests when features change
- Remove obsolete tests
- Refactor tests for clarity
- Update test data as needed
- Monitor coverage trends

### When to Add Tests

- New features
- Bug fixes (regression tests)
- Refactoring (ensure behavior unchanged)
- Performance optimizations

### When to Skip Tests

- Trivial code (simple getters/setters)
- Third-party library code
- Generated code
- Configuration files

## Continuous Improvement

### Metrics to Track

- Test execution time
- Coverage percentage
- Flaky test rate
- Test maintenance cost

### Review Process

- Regular test reviews in PRs
- Test quality discussions
- Test strategy updates as needed
- Share testing best practices

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Questions?

If you have questions about testing:

1. Check this document
2. Review existing test examples
3. Ask in team discussions
4. Update this document with new patterns
