import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getAllCandidates } from '../../../lib/api/candidates'
import { getApplications } from '../../../lib/api/applications'
import type { Profile, Application } from '../../../types'

export function CandidatesDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Profile[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const candidatesData = await getAllCandidates()
      setCandidates(candidatesData)

      // Load applications for all candidates
      const allApps: Application[] = []
      for (const candidate of candidatesData) {
        const apps = await getApplications(candidate.user_id)
        allApps.push(...apps)
      }
      setApplications(allApps)
    } catch (error) {
      console.error('Error loading data:', error)
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

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch =
      candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filterStatus === 'all') return true

    const status = getCandidateApplicationStatus(candidate.user_id)
    return status === filterStatus
  })

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading...</div>
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
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Candidates</option>
              <option value="no_applications">No Applications</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="more_info_requested">More Info Requested</option>
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
                      {candidate.profile_completed_at ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
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
