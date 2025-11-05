import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hands - Driver Screening Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Simplify driver screening and onboarding</p>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">For Candidates</h2>
          <p className="text-gray-600">
            Register, complete your profile, and apply for driver positions with a streamlined
            application process.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">For Managers</h2>
          <p className="text-gray-600">
            Post job openings, review candidates, and manage applications with powerful dashboards
            and tools.
          </p>
        </div>
      </div>
    </div>
  )
}
