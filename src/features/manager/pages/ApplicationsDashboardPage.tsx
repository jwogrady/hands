import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getAllApplications } from '../../../lib/api/manager'
import { getJob } from '../../../lib/api/jobs'
import { getProfile } from '../../../lib/api/profile'
import type { Application, Job, Profile } from '../../../types'

export function ApplicationsDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<
    (Application & { job?: Job; candidate?: Profile })[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterJob, setFilterJob] = useState<string>('all')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const apps = await getAllApplications()

      // Load job and candidate details
      const appsWithDetails = await Promise.all(
        apps.map(async app => {
          const [job, candidate] = await Promise.all([
            getJob(app.job_id),
            getProfile(app.candidate_id),
          ])
          return { ...app, job, candidate }
        })
      )

      setApplications(appsWithDetails)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const uniqueJobs = Array.from(new Set(applications.map(app => app.job?.id).filter(Boolean)))

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.candidate?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filterStatus !== 'all' && app.status !== filterStatus) return false
    if (filterJob !== 'all' && app.job_id !== filterJob) return false

    return true
  })

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'more_info_requested':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Applications Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by candidate name, email, or job title..."
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
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="more_info_requested">More Info Requested</option>
            </select>
          </div>
          <div>
            <select
              value={filterJob}
              onChange={e => setFilterJob(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map(jobId => {
                const job = applications.find(app => app.job_id === jobId)?.job
                return (
                  <option key={jobId} value={jobId}>
                    {job?.title || 'Unknown Job'}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map(application => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.candidate?.full_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{application.candidate?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {application.job?.title || 'Job Title N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {application.reviewed_at
                        ? new Date(application.reviewed_at).toLocaleDateString()
                        : 'Not reviewed'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate({ to: `/manager/applications/${application.id}` })}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
