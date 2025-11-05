import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignUpPage } from '@/features/auth/pages/SignUpPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileCreationPage } from '@/features/profile/pages/ProfileCreationPage'
import { EmploymentHistoryPage } from '@/features/profile/pages/EmploymentHistoryPage'
import { BackgroundQuestionsPage } from '@/features/profile/pages/BackgroundQuestionsPage'
import { EmergencyContactsPage } from '@/features/profile/pages/EmergencyContactsPage'
import { DocumentsPage } from '@/features/profile/pages/DocumentsPage'
import { AuthorizationsPage } from '@/features/profile/pages/AuthorizationsPage'
import { JobPostingListPage } from '@/features/jobs/pages/JobPostingListPage'
import { JobPostingFormPage } from '@/features/jobs/pages/JobPostingFormPage'
import { JobBrowsePage } from '@/features/jobs/pages/JobBrowsePage'
import { JobDetailsPage } from '@/features/jobs/pages/JobDetailsPage'
import { ApplicationsPage } from '@/features/applications/pages/ApplicationsPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { CandidatesDashboardPage } from '@/features/manager/pages/CandidatesDashboardPage'
import { CandidateDetailPage } from '@/features/manager/pages/CandidateDetailPage'
import { ApplicationsDashboardPage } from '@/features/manager/pages/ApplicationsDashboardPage'
import { ApplicationReviewPage } from '@/features/manager/pages/ApplicationReviewPage'
import { PublicJobPage } from '@/features/jobs/pages/PublicJobPage'

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
})

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Public job page (no authentication required)
// This route comes before the protected job details route to allow public access
const publicJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId/public',
  component: PublicJobPage,
})

// Also allow /jobs/$jobId to be public (for easier sharing)
const publicJobRouteAlt = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: PublicJobPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
})

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
})

// Profile routes (protected)
const profileCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/create',
  component: () => (
    <ProtectedRoute>
      <ProfileCreationPage />
    </ProtectedRoute>
  ),
})

const employmentHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/employment-history',
  component: () => (
    <ProtectedRoute>
      <EmploymentHistoryPage />
    </ProtectedRoute>
  ),
})

const backgroundQuestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/background-questions',
  component: () => (
    <ProtectedRoute>
      <BackgroundQuestionsPage />
    </ProtectedRoute>
  ),
})

const emergencyContactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/emergency-contacts',
  component: () => (
    <ProtectedRoute>
      <EmergencyContactsPage />
    </ProtectedRoute>
  ),
})

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/documents',
  component: () => (
    <ProtectedRoute>
      <DocumentsPage />
    </ProtectedRoute>
  ),
})

const authorizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/authorizations',
  component: () => (
    <ProtectedRoute>
      <AuthorizationsPage />
    </ProtectedRoute>
  ),
})

// Job routes (protected)
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: () => (
    <ProtectedRoute>
      <JobPostingListPage />
    </ProtectedRoute>
  ),
})

const jobsCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/create',
  component: () => (
    <ProtectedRoute>
      <JobPostingFormPage />
    </ProtectedRoute>
  ),
})

const jobsEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId/edit',
  component: () => (
    <ProtectedRoute>
      <JobPostingFormPage />
    </ProtectedRoute>
  ),
})

const jobsBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/browse',
  component: () => (
    <ProtectedRoute>
      <JobBrowsePage />
    </ProtectedRoute>
  ),
})

// Protected job details route for authenticated users (application page)
// Note: This conflicts with public route, so we'll use a different path for authenticated application
const jobApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId/apply',
  component: () => (
    <ProtectedRoute>
      <JobDetailsPage />
    </ProtectedRoute>
  ),
})

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/applications',
  component: () => (
    <ProtectedRoute>
      <ApplicationsPage />
    </ProtectedRoute>
  ),
})

// Manager routes (protected)
const managerCandidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/candidates',
  component: () => (
    <ProtectedRoute>
      <CandidatesDashboardPage />
    </ProtectedRoute>
  ),
})

const managerCandidateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/candidates/$candidateId',
  component: () => (
    <ProtectedRoute>
      <CandidateDetailPage />
    </ProtectedRoute>
  ),
})

const managerApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/applications',
  component: () => (
    <ProtectedRoute>
      <ApplicationsDashboardPage />
    </ProtectedRoute>
  ),
})

const managerApplicationReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/applications/$applicationId',
  component: () => (
    <ProtectedRoute>
      <ApplicationReviewPage />
    </ProtectedRoute>
  ),
})

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  publicJobRoute,
  publicJobRouteAlt,
  dashboardRoute,
  profileCreateRoute,
  employmentHistoryRoute,
  backgroundQuestionsRoute,
  emergencyContactsRoute,
  documentsRoute,
  authorizationsRoute,
  jobsRoute,
  jobsCreateRoute,
  jobsEditRoute,
  jobsBrowseRoute,
  jobApplicationRoute,
  applicationsRoute,
  managerCandidatesRoute,
  managerCandidateDetailRoute,
  managerApplicationsRoute,
  managerApplicationReviewRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
