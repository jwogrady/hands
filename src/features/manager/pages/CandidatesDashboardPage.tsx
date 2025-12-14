import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getAllCandidates } from '../../../lib/api/candidates'
import { supabase } from '../../../lib/supabase'
import { getEmploymentHistory, getCDLEmploymentHistory } from '../../../lib/api/employmentHistory'
import { getBackgroundQuestions, BACKGROUND_QUESTIONS } from '../../../lib/api/backgroundQuestions'
import { getEmergencyContacts } from '../../../lib/api/emergencyContacts'
import { getDocuments } from '../../../lib/api/documents'
import { getAuthorizations } from '../../../lib/api/authorizations'
import type { Profile, Application } from '../../../types'

export function CandidatesDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Profile[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [hideIncomplete, setHideIncomplete] = useState<boolean>(true) // Default to hiding incomplete profiles
  const [hideNoApplications, setHideNoApplications] = useState<boolean>(true) // Default to hiding candidates with no applications
  const [profileCompletionStatus, setProfileCompletionStatus] = useState<Record<string, boolean>>(
    {}
  )

  useEffect(() => {
    loadData()
  }, [])

  // Check if a profile is complete using the same logic as the dashboard
  const checkProfileComplete = async (profile: Profile): Promise<boolean> => {
    // If profile_completed_at is set, it's explicitly marked as complete
    if (profile.profile_completed_at) {
      return true
    }

    // Otherwise, check all sections
    const checkPersonalInfoComplete = (profile: Profile): boolean => {
      return !!(
        profile.full_name &&
        profile.phone &&
        profile.ssn &&
        profile.date_of_birth &&
        profile.present_address_street &&
        profile.present_address_city &&
        profile.present_address_state &&
        profile.present_address_zip
      )
    }

    try {
      const personalInfo = checkPersonalInfoComplete(profile)
      const [
        employmentHistory,
        cdlDrivingExperience,
        backgroundQuestions,
        emergencyContacts,
        documents,
        authorizations,
      ] = await Promise.all([
        getEmploymentHistory(profile.user_id)
          .then(emp => emp.length > 0)
          .catch(() => false),
        getCDLEmploymentHistory(profile.user_id)
          .then(cdl => cdl.length > 0)
          .catch(() => false),
        getBackgroundQuestions(profile.user_id)
          .then(q => q.length === BACKGROUND_QUESTIONS.length)
          .catch(() => false),
        getEmergencyContacts(profile.user_id)
          .then(c => c.length >= 1)
          .catch(() => false),
        getDocuments(profile.user_id)
          .then(d => d.length > 0)
          .catch(() => false),
        getAuthorizations(profile.user_id)
          .then(a => {
            const requiredTypes: Array<
              | 'applicant_certification'
              | 'fmcsa_clearinghouse'
              | 'hireright_background'
              | 'psp_authorization'
            > = [
              'applicant_certification',
              'fmcsa_clearinghouse',
              'hireright_background',
              'psp_authorization',
            ]
            const signedTypes = a.filter(auth => auth.signed).map(auth => auth.authorization_type)
            return requiredTypes.every(type => signedTypes.includes(type))
          })
          .catch(() => false),
      ])

      return (
        personalInfo &&
        employmentHistory &&
        cdlDrivingExperience &&
        backgroundQuestions &&
        emergencyContacts &&
        documents &&
        authorizations
      )
    } catch (error) {
      console.error(`Error checking profile completion for ${profile.user_id}:`, error)
      return false
    }
  }

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const candidatesData = await getAllCandidates()
      setCandidates(candidatesData)

      if (candidatesData.length === 0) {
        setLoading(false)
        return
      }

      // Batch load applications for all candidates in a single query
      // Get all candidate user IDs
      const candidateUserIds = candidatesData.map(c => c.user_id)

      // Query all applications for these candidates at once
      const { data: allAppsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .in('candidate_id', candidateUserIds)
        .order('submitted_at', { ascending: false })

      if (appsError) {
        console.error('Error loading applications:', appsError)
        // Don't fail completely - just log and continue without applications
        setApplications([])
      } else {
        setApplications(allAppsData || [])
      }

      // Check profile completion status for all candidates in parallel
      const completionStatus: Record<string, boolean> = {}
      await Promise.all(
        candidatesData.map(async candidate => {
          completionStatus[candidate.user_id] = await checkProfileComplete(candidate)
        })
      )
      setProfileCompletionStatus(completionStatus)
    } catch (error) {
      console.error('Error loading data:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load candidates. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getCandidateApplicationStatus = (userId: string): string => {
    const candidateApps = applications.filter(app => app.candidate_id === userId)
    if (candidateApps.length === 0) return 'no_applications'
    const latest = candidateApps[0]
    return latest.status
  }

  // Get unique application statuses that actually exist in the data
  const getAvailableStatuses = (): string[] => {
    const statusSet = new Set<string>()
    candidates.forEach(candidate => {
      const status = getCandidateApplicationStatus(candidate.user_id)
      if (status !== 'no_applications') {
        statusSet.add(status)
      }
    })
    return Array.from(statusSet).sort()
  }

  const filteredCandidates = candidates.filter(candidate => {
    // Filter by search term
    const matchesSearch =
      candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Filter by profile completion (hide incomplete if checkbox is checked)
    if (hideIncomplete && !profileCompletionStatus[candidate.user_id]) {
      return false
    }

    // Filter by applications (hide no applications if checkbox is checked)
    const status = getCandidateApplicationStatus(candidate.user_id)
    if (hideNoApplications && status === 'no_applications') {
      return false
    }

    // Filter by application status
    if (filterStatus === 'all') return true

    return status === filterStatus
  })

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading...</div>
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error Loading Candidates</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
              <button
                onClick={loadData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Candidates Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hideIncomplete}
                onChange={e => setHideIncomplete(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Hide incomplete profiles</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hideNoApplications}
                onChange={e => setHideNoApplications(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Hide no applications</span>
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              {getAvailableStatuses().map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">No candidates found.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CDL Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile Complete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map(candidate => {
                const status = getCandidateApplicationStatus(candidate.user_id)
                const statusColors: Record<string, string> = {
                  no_applications: 'bg-gray-100 text-gray-800',
                  submitted: 'bg-blue-100 text-blue-800',
                  under_review: 'bg-yellow-100 text-yellow-800',
                  approved: 'bg-green-100 text-green-800',
                  rejected: 'bg-red-100 text-red-800',
                  more_info_requested: 'bg-orange-100 text-orange-800',
                }

                return (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.full_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.cdl_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {status === 'no_applications'
                          ? 'No Applications'
                          : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {profileCompletionStatus[candidate.user_id] ? (
                        <span className="text-green-600 text-sm font-medium">✓ Complete</span>
                      ) : (
                        <span className="text-gray-400 text-sm">Incomplete</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate({ to: `/manager/candidates/${candidate.user_id}` })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
