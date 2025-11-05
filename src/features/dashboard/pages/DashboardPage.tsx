import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getUserRoles } from '../../../lib/api/userRoles'
import { getProfile } from '../../../lib/api/profile'
import type { UserRole } from '../../../types'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const roles = await getUserRoles(user.id)
      setUserRoles(roles)

      const profile = await getProfile(user.id)
      setProfileComplete(!!profile?.profile_completed_at)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const isManager = userRoles.some(role => role.role === 'manager')
  const isCandidate = userRoles.some(role => role.role === 'candidate')

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Candidate Dashboard */}
      {isCandidate && (
        <div className="space-y-6">
          {!profileComplete && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-900">Complete Your Profile</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please complete your profile before applying for jobs. This includes personal
                    information, employment history, background questions, emergency contacts,
                    documents, and authorizations.
                  </p>
                  <button
                    onClick={() => navigate({ to: '/profile/create' })}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
                  >
                    Complete Profile →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/profile/create' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Complete/Update Profile</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Personal info, addresses, CDL, driving experience
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/employment-history' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Employment History</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Last 3 years + 7 years CDL employment
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/background-questions' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Background Questions</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Answer required background questions
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/emergency-contacts' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Emergency Contacts</div>
                  <div className="text-sm text-gray-600 mt-1">Add up to 3 emergency contacts</div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/documents' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Documents</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Upload resume, CDL license, certifications
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/authorizations' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Authorizations</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sign required authorizations and releases
                  </div>
                </button>
              </div>
            </div>

            {/* Job Applications */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/jobs/browse' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Browse Jobs</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View available job postings and apply
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/applications' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">My Applications</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Track the status of your applications
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Dashboard */}
      {isManager && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Posting Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Posting Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/jobs' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Manage Job Postings</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View, create, edit, and manage job postings
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/jobs/create' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Create New Job Posting</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Post a new job with custom questions
                  </div>
                </button>
              </div>
            </div>

            {/* Candidate & Application Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Review & Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/manager/candidates' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Candidates Dashboard</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View and filter candidate profiles
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/manager/applications' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Applications Dashboard</div>
                  <div className="text-sm text-gray-600 mt-1">Review and manage applications</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No role assigned */}
      {!isManager && !isCandidate && (
        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-gray-600">No role assigned. Please contact an administrator.</p>
        </div>
      )}
    </div>
  )
}
