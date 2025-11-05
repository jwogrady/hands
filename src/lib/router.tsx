import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignUpPage } from '@/features/auth/pages/SignUpPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

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

// Protected routes (placeholder for now)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Protected content goes here</p>
      </div>
    </ProtectedRoute>
  ),
})

// Route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signUpRoute, dashboardRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
