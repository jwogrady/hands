import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { getJobs } from '@/lib/api/jobs'
import { useState, useEffect } from 'react'
import type { Job } from '@/types'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getJobs(false) // Only active jobs
        setJobs(data.slice(0, 3)) // Show up to 3 jobs on homepage
      } catch (error) {
        console.error('Error loading jobs:', error)
      }
    }
    loadJobs()
  }, [])

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

      <div className="mt-16 grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">For Candidates</h2>
          <p className="text-gray-600 mb-4">
            Register, complete your profile, and apply for driver positions with a streamlined
            application process.
          </p>
          {isAuthenticated ? (
            <Link to="/jobs/browse" className="text-blue-600 hover:text-blue-800 font-medium">
              Browse Jobs →
            </Link>
          ) : (
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Get Started →
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">For Managers</h2>
          <p className="text-gray-600 mb-4">
            Post job openings, review candidates, and manage applications with powerful dashboards
            and tools.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
              Go to Dashboard →
            </Link>
          ) : (
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign In →
            </Link>
          )}
        </div>
      </div>

      {/* Featured Jobs */}
      {jobs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    <p className="text-sm text-gray-500">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => navigate({ to: `/jobs/${job.id}` })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isAuthenticated && (
            <div className="mt-6 text-center">
              <Link to="/jobs/browse" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Jobs →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
