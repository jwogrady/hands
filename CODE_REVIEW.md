# Code Review: UI, Permissions, and Dashboard Behavior

## End-to-End Trace Analysis

**Date:** 2025-01-14  
**Scope:** UI actions, permissions, dashboards, role-based access control

---

## 🎯 High-Level Assessment

### What Works Reliably

- **Authentication flow:** `useAuth` hook properly manages session state
- **Route protection:** `ProtectedRoute` and `ManagerRoute` components correctly gate access
- **RLS policies:** Backend permissions are well-structured and comprehensive
- **API error handling:** Most API functions handle errors gracefully with console logging

### What Is Fragile

- **Role loading:** `getUserRoles` has potential race conditions and RLS dependency issues
- **Dashboard state:** Profile completion checks run sequentially and may fail silently
- **Manager route checks:** `ManagerRoute` queries roles but redirects on failure without proper error states
- **Job posting access:** No explicit frontend role checks for job creation/edit routes

### What Will Break in Production

- **"No role assigned" bug:** Users seeing empty dashboards due to role query failures
- **Candidate list performance:** N+1 queries in `CandidatesDashboardPage` loading applications
- **Missing loading states:** Several buttons/actions don't show loading indicators
- **Error visibility:** Most errors only logged to console, users see blank states
- **Manager job access:** `/jobs` route accessible to candidates but edit/create buttons should be hidden

---

## 🚨 Critical Issues (Must Fix Before Release)

### 1. Broken: Role Loading Causes Empty Dashboards

**Location:** `src/lib/api/userRoles.ts`, `src/features/dashboard/pages/DashboardPage.tsx`

**Issue:**

- `getUserRoles()` uses `supabase.auth.getUser()` but RLS policy expects `auth.uid()` in the query context
- If RLS check fails, roles return empty array
- Dashboard shows "No role assigned" even for valid users

**Impact:** ALL users affected - managers and candidates see empty dashboards

**Trace:**

```
DashboardPage.loadUserData()
  → getUserRoles(user.id)
    → supabase.auth.getUser() ✅
    → supabase.from('user_roles').select('*').eq('user_id', currentUser.id) ❌ RLS may block
    → Returns []
    → isManager = false, isCandidate = false
    → Shows "No role assigned"
```

**Fix Required:**

```typescript
// Current approach is correct but needs error handling
export async function getUserRoles(_userId: string): Promise<UserRole[]> {
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !currentUser) {
    throw new Error('Not authenticated') // Don't silently fail
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', currentUser.id)

  if (error) {
    // Check if it's an RLS error specifically
    if (error.code === '42501' || error.message.includes('permission')) {
      console.error('RLS permission denied - check user_roles policies')
    }
    throw error // Don't return empty array
  }

  return data || []
}
```

**DashboardPage needs error state:**

```typescript
const [error, setError] = useState<string | null>(null)

// In loadUserData:
try {
  const roles = await getUserRoles(user.id)
  if (roles.length === 0) {
    setError('No roles assigned. Please contact an administrator.')
  }
  setUserRoles(roles)
} catch (error) {
  setError('Failed to load user roles. Please refresh the page.')
  console.error('Error loading user data:', error)
}
```

---

### 2. Broken: Job Posting Routes Not Role-Protected in Frontend

**Location:** `src/lib/router.tsx`, `src/features/jobs/pages/JobPostingListPage.tsx`

**Issue:**

- `/jobs`, `/jobs/create`, `/jobs/$jobId/edit` routes use `ProtectedRoute` only
- No role checks - candidates can access job management UI
- RLS will block mutations, but UI shows buttons that will fail

**Trace:**

```
Candidate clicks "Dashboard" → "Manage Job Postings" button
  → Navigates to /jobs ✅ (ProtectedRoute allows)
  → JobPostingListPage renders ✅
  → Shows "Create Job Posting" button ✅ (WRONG - candidate shouldn't see this)
  → Candidate clicks "Create" → /jobs/create ✅
  → Form renders ✅ (WRONG)
  → Submit → createJob() → RLS blocks ❌ (silent failure)
```

**Impact:** Poor UX - candidates see non-functional UI elements

**Fix Required:**

- Option 1: Wrap job routes in `ManagerRoute`
- Option 2: Add role checks inside components and conditionally render

**Recommended Fix:**

```typescript
// In router.tsx - wrap job management routes
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: () => (
    <ManagerRoute> {/* Change from ProtectedRoute */}
      <JobPostingListPage />
    </ManagerRoute>
  ),
})

// Keep /jobs/browse public for candidates
const jobsBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/browse',
  component: () => (
    <ProtectedRoute>
      <JobBrowsePage />
    </ProtectedRoute>
  ),
})
```

---

### 3. Broken: Manager Dashboard Buttons Missing Permission Verification

**Location:** `src/features/dashboard/pages/DashboardPage.tsx:189-229`

**Issue:**

- Manager dashboard buttons navigate without verifying current user can actually access target routes
- If `ManagerRoute` fails, user gets redirected but no feedback

**Trace:**

```
Manager Dashboard renders ✅
  → Button "Candidates Dashboard" clicked
    → navigate({ to: '/manager/candidates' })
    → ManagerRoute checks role
    → If check fails (network error, RLS issue) → redirects to /dashboard
    → No error message shown to user
```

**Impact:** Silent failures, confusing UX

**Fix Required:**

- `ManagerRoute` should show error message before redirect
- Or buttons should pre-verify permissions

---

### 4. Performance: N+1 Query Problem in Candidates Dashboard

**Location:** `src/features/manager/pages/CandidatesDashboardPage.tsx:19-36`

**Issue:**

```typescript
for (const candidate of candidatesData) {
  const apps = await getApplications(candidate.user_id) // N queries!
  allApps.push(...apps)
}
```

**Impact:** With 10 candidates = 11 queries (1 for candidates + 10 for applications)

- Slow page loads
- High database load
- Poor scalability

**Fix Required:**

```typescript
// Option 1: Batch query (if RLS allows)
const allApps = await supabase.from('applications').select('*').in('candidate_id', candidateUserIds)

// Option 2: Single query with join
const { data } = await supabase
  .from('applications')
  .select('*, candidate:profiles!candidate_id(*)')
  .in('candidate_id', candidateUserIds)
```

---

### 5. Missing: Error States in Multiple Components

**Locations:** Multiple

**Issues:**

- `CandidatesDashboardPage`: Only shows "Loading..." or empty state, no error message
- `ApplicationsDashboardPage`: Same issue
- `DashboardPage`: Errors logged but user sees "No role assigned"
- `JobPostingListPage`: Errors logged, user sees stale data

**Fix Required:** Add error state handling to all data-fetching components:

```typescript
const [error, setError] = useState<string | null>(null)

try {
  // ... data loading
} catch (err) {
  setError('Failed to load data. Please try again.')
  console.error(err)
}

// In render:
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-800">{error}</p>
    <button onClick={retry}>Retry</button>
  </div>
)}
```

---

## 📊 Dashboard-Specific Findings

### Manager Dashboard

**Works:**

- ✅ Correctly shows only for managers (`isManager && !isCandidate`)
- ✅ Buttons navigate to correct routes
- ✅ Layout is clean and functional

**Broken:**

- ❌ No error handling if role check fails
- ❌ Buttons don't verify permissions before navigation
- ❌ No loading state during role verification
- ❌ No feedback if `ManagerRoute` redirects

**Missing:**

- No quick stats (candidate count, application count, etc.)
- No recent activity feed
- No empty state message if no candidates/jobs exist

---

### Candidate Dashboard

**Works:**

- ✅ Profile completion status checks work correctly
- ✅ Dynamic "Get Started" / "Complete Profile" button
- ✅ All navigation buttons functional
- ✅ Status indicators show correctly

**Broken:**

- ❌ If profile checks fail, user sees empty dashboard
- ❌ No error recovery mechanism
- ❌ Sequential async checks cause slow initial render

**Missing:**

- Loading skeletons during profile status checks
- Error messages if data fails to load
- Retry mechanism for failed checks

**Performance Issue:**

```typescript
// Sequential async calls - could be parallel
const personalInfo = checkPersonalInfoComplete(profile)
const employmentHistory = await checkEmploymentHistoryComplete(user.id)
const cdlDrivingExperience = await checkCDLDrivingExperienceComplete(user.id)
// ... etc
```

**Should be:**

```typescript
const [
  personalInfo,
  employmentHistory,
  cdlDrivingExperience,
  backgroundQuestions,
  emergencyContacts,
  documents,
  authorizations,
] = await Promise.all([
  Promise.resolve(checkPersonalInfoComplete(profile)),
  checkEmploymentHistoryComplete(user.id),
  checkCDLDrivingExperienceComplete(user.id),
  checkBackgroundQuestionsComplete(user.id),
  checkEmergencyContactsComplete(user.id),
  checkDocumentsComplete(user.id),
  checkAuthorizationsComplete(user.id),
])
```

---

## 🔐 Permission Model Findings

### Backend (RLS Policies)

**Strengths:**

- ✅ Comprehensive coverage - all tables have RLS enabled
- ✅ Role-based policies properly structured
- ✅ Self-referential checks work correctly (managers can see all via user_roles check)

**Issues:**

- ⚠️ Circular dependency risk: "Managers can view all roles" policy queries `user_roles` table
  - If RLS fails on initial role check, manager can't verify they're a manager
  - Currently works because policy is permissive (OR logic), but fragile

**Recommendation:**

```sql
-- Current works but is risky
CREATE POLICY "Managers can view all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()  -- This queries same table!
      AND ur.role = 'manager'
    )
  );

-- Better: Use a function that bypasses RLS for role checks
CREATE OR REPLACE FUNCTION is_manager(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER  -- Bypasses RLS
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'manager'
  );
$$;

CREATE POLICY "Managers can view all roles"
  ON user_roles FOR SELECT
  USING (is_manager(auth.uid()));
```

---

### Frontend Permission Checks

**Issues:**

1. **Inconsistent role checking:**
   - `DashboardPage` checks `userRoles.some(role => role.role === 'manager')`
   - `ManagerRoute` does the same check
   - No shared utility function

2. **Missing checks:**
   - `JobPostingListPage` shows "Create" button to all users
   - No check if user is manager before showing job management UI
   - Profile pages don't verify user owns the profile (relying on RLS only)

3. **No permission utilities:**
   - Should have `useUserRoles()` hook
   - Should have `useIsManager()` and `useIsCandidate()` hooks
   - Should have `requireManager()` utility

**Recommended Fix:**

```typescript
// hooks/useUserRoles.ts
export function useUserRoles() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    getUserRoles(user.id)
      .then(setRoles)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [user])

  return {
    roles,
    isManager: roles.some(r => r.role === 'manager'),
    isCandidate: roles.some(r => r.role === 'candidate'),
    loading,
    error,
  }
}
```

---

## 🎨 UI Interaction Issues

### Buttons & Actions

**Working:**

- ✅ All buttons have `onClick` handlers
- ✅ Navigation buttons use `navigate()` correctly
- ✅ Form submissions properly handled

**Issues:**

- ❌ No loading states on async actions (delete job, toggle active, etc.)
- ❌ No confirmation dialogs except `handleDelete` in JobPostingListPage
- ❌ No success feedback after actions complete
- ❌ Buttons don't disable during async operations (double-click risk)

**Example - JobPostingListPage:**

```typescript
// Current - no loading state
const handleToggleActive = async (job: Job) => {
  try {
    await updateJob(job.id, { is_active: !job.is_active })
    await loadJobs() // User sees no feedback during this
  } catch (error) {
    alert('Failed to update job status.') // Only on error
  }
}

// Should be:
const [updating, setUpdating] = useState<Record<string, boolean>>({})

const handleToggleActive = async (job: Job) => {
  setUpdating(prev => ({ ...prev, [job.id]: true }))
  try {
    await updateJob(job.id, { is_active: !job.is_active })
    await loadJobs()
    // Show success toast/message
  } catch (error) {
    alert('Failed to update job status.')
  } finally {
    setUpdating(prev => ({ ...prev, [job.id]: false }))
  }
}

// In render:
<button
  onClick={() => handleToggleActive(job)}
  disabled={updating[job.id]}
  className={updating[job.id] ? 'opacity-50 cursor-not-allowed' : ''}
>
  {updating[job.id] ? 'Updating...' : (job.is_active ? 'Deactivate' : 'Activate')}
</button>
```

---

### Navigation Integrity

**Issues:**

1. **Deep links:** Public job page uses `window.location.pathname` instead of router params

   ```typescript
   // Current - fragile
   const pathParts = location.split('/').filter(Boolean)
   const jobId = pathParts[1]

   // Should use TanStack Router params
   const { jobId } = useParams({ from: '/jobs/$jobId' })
   ```

2. **Protected routes:** No redirect after login with return URL support in all routes

3. **Manager routes:** Redirects to `/dashboard` but that might also fail if roles not loaded

---

## 📋 Actionable Fixes

### Priority 1: Critical (Fix Immediately)

1. **Fix role loading in DashboardPage**
   - File: `src/lib/api/userRoles.ts`
   - Add proper error handling, don't return empty array on failure
   - File: `src/features/dashboard/pages/DashboardPage.tsx`
   - Add error state and user feedback

2. **Protect job management routes**
   - File: `src/lib/router.tsx`
   - Change `/jobs`, `/jobs/create`, `/jobs/$jobId/edit` to use `ManagerRoute`

3. **Fix N+1 query in CandidatesDashboardPage**
   - File: `src/features/manager/pages/CandidatesDashboardPage.tsx`
   - Use batch query or join instead of loop

4. **Add error states to all data-loading components**
   - Files: All page components that fetch data
   - Show user-friendly error messages with retry options

### Priority 2: High (Fix Before Release)

5. **Create permission hooks**
   - New file: `src/hooks/useUserRoles.ts`
   - Refactor all role checks to use shared hook

6. **Add loading states to async actions**
   - Files: All components with async button handlers
   - Disable buttons, show loading indicators

7. **Fix PublicJobPage route params**
   - File: `src/features/jobs/pages/PublicJobPage.tsx`
   - Use TanStack Router params instead of parsing URL

8. **Parallelize profile status checks**
   - File: `src/features/dashboard/pages/DashboardPage.tsx`
   - Use `Promise.all()` instead of sequential awaits

### Priority 3: Medium (Fix Soon)

9. **Add success feedback for actions**
   - Toast notifications or inline success messages

10. **Improve RLS policy for manager role checks**
    - File: `supabase/migrations/20250101000000_initial_schema.sql`
    - Use `SECURITY DEFINER` function for role checks

11. **Add confirmation dialogs for destructive actions**
    - File: `src/features/jobs/pages/JobPostingListPage.tsx` (already has for delete)
    - Add for other destructive actions

12. **Add empty states with helpful CTAs**
    - All list views should have helpful empty states

---

## 🧪 Recommended Testing

### Missing Test Coverage

1. **Role-based routing tests:**
   - Verify candidates can't access `/manager/*` routes
   - Verify managers can access all manager routes
   - Verify unauthenticated users redirected to login

2. **Permission tests:**
   - Verify job creation blocked for candidates via RLS
   - Verify candidates can only see their own applications
   - Verify managers can see all candidates

3. **UI interaction tests:**
   - Verify buttons trigger correct handlers
   - Verify loading states show during async operations
   - Verify error states display correctly

4. **Dashboard tests:**
   - Verify correct dashboard shows for each role
   - Verify "No role assigned" shows when roles empty
   - Verify profile status checks work correctly

### Test Recommendations

```typescript
// Example test structure needed:

describe('DashboardPage', () => {
  it('shows manager dashboard for managers', async () => {
    // Mock user with manager role
    // Verify manager dashboard renders
  })

  it('shows candidate dashboard for candidates', async () => {
    // Mock user with candidate role
    // Verify candidate dashboard renders
  })

  it('shows error when roles fail to load', async () => {
    // Mock getUserRoles to fail
    // Verify error message displays
  })
})

describe('ManagerRoute', () => {
  it('redirects candidates to dashboard', async () => {
    // Mock candidate user
    // Verify redirect to /dashboard
  })

  it('shows content for managers', async () => {
    // Mock manager user
    // Verify children render
  })
})
```

---

## 🎯 Recommended Next Steps

### Immediate (This Week)

1. Fix role loading issue (Priority 1 #1)
2. Protect job routes (Priority 1 #2)
3. Fix N+1 query (Priority 1 #3)
4. Add error states to critical pages (Priority 1 #4)

### Short Term (Next Sprint)

5. Create permission hooks (Priority 2 #5)
6. Add loading states (Priority 2 #6)
7. Fix route params (Priority 2 #7)
8. Parallelize checks (Priority 2 #8)

### Medium Term (Next Month)

9. Improve RLS policies (Priority 3 #10)
10. Add comprehensive test coverage
11. Improve UX with toasts and confirmations
12. Add analytics to track permission errors

---

## 📝 Summary

**Overall Assessment:** The application has a solid foundation with comprehensive RLS policies and good route structure. However, there are critical issues with role loading and permission checks that will cause production failures. The UI lacks proper error handling and loading states, which will lead to poor user experience.

**Critical Path:** Fix role loading → Protect routes → Add error handling → Improve UX

**Risk Level:** **HIGH** - The role loading issue affects all authenticated users and will cause widespread dashboard failures in production.

**Confidence:** The permission model is sound, but the implementation needs hardening around error cases and edge conditions.
