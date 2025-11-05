import { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getJob, getJobQuestions } from '../../../lib/api/jobs'
import type { Job, JobQuestion } from '../../../types'

export function PublicJobPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = window.location.pathname
  // Extract jobId from path like /jobs/$jobId or /jobs/$jobId/public
  const pathParts = location.split('/').filter(Boolean)
  const jobId = pathParts[1] // Second segment after 'jobs'

  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<Job | null>(null)
  const [questions, setQuestions] = useState<JobQuestion[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (jobId) {
      loadJobDetails()
    }
  }, [jobId])

  const loadJobDetails = async () => {
    if (!jobId) return
    setLoading(true)
    try {
      const jobData = await getJob(jobId)
      if (jobData && jobData.is_active) {
        setJob(jobData)
        const jobQuestions = await getJobQuestions(jobId)
        setQuestions(jobQuestions)
      }
    } catch (error) {
      console.error('Error loading job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If authenticated, go to application page
      navigate({ to: `/jobs/${jobId}/apply` })
    } else {
      // If not authenticated, go to sign up with return URL
      navigate({ to: `/signup?returnTo=${encodeURIComponent(`/jobs/${jobId}/apply`)}` })
    }
  }

  const handleSignIn = () => {
    navigate({ to: `/login?returnTo=${encodeURIComponent(`/jobs/${jobId}/apply`)}` })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            This job posting may have been removed or is no longer available.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Hands
            </Link>
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs/browse"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Apply?</h2>
            <p className="text-gray-700 mb-4">
              {isAuthenticated
                ? 'You can start your application now. Make sure your profile is complete before applying.'
                : 'Create an account or sign in to start your application. The process takes about 10-15 minutes.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg"
              >
                {isAuthenticated ? 'Apply Now' : 'Get Started - Sign Up Free'}
              </button>
              {!isAuthenticated && (
                <button
                  onClick={handleSignIn}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Already have an account? Sign In
                </button>
              )}
            </div>
          </div>

          {/* Job Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {/* Requirements */}
          {job.requirements && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.requirements}
              </div>
            </section>
          )}

          {/* Application Questions Preview */}
          {questions.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Application Questions</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              {showPreview && (
                <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    You'll be asked to answer these questions when you apply:
                  </p>
                  {questions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      {question.question_type === 'select' && question.options && (
                        <p className="text-sm text-gray-600 mt-1">
                          Options: {question.options.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* What to Expect */}
          <section className="bg-gray-50 border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Complete your profile (one-time setup)</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Answer job-specific questions</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Track your application status</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Receive updates on your application</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Secondary CTA */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Start Your Application?
          </h2>
          <p className="text-gray-600 mb-6">
            Join our team and start your journey today. The application process is quick and easy.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg"
          >
            {isAuthenticated ? 'Continue to Application' : "Get Started - It's Free"}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© {new Date().getFullYear()} Hands. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
