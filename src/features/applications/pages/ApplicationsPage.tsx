import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getApplications } from '../../../lib/api/applications'
import { getJob } from '../../../lib/api/jobs'
import type { Application, Job } from '../../../types'

export function ApplicationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<(Application & { job?: Job })[]>([])

  useEffect(() => {
    if (user) {
      loadApplications()
    }
  }, [user])

  const loadApplications = async () => {
    if (!user) return
    setLoading(true)
    try {
      const apps = await getApplications(user.id)

      // Load job details for each application
      const appsWithJobs = await Promise.all(
        apps.map(async app => {
          const job = await getJob(app.job_id)
          return { ...app, job }
        })
      )

      setApplications(appsWithJobs)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusLabel = (status: Application['status']) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'under_review':
        return 'Under Review'
      case 'more_info_requested':
        return 'More Info Requested'
      default:
        return 'Submitted'
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your job applications</p>
        </div>
        <button
          onClick={() => navigate({ to: '/jobs/browse' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Browse Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't submitted any applications yet.</p>
          <button
            onClick={() => navigate({ to: '/jobs/browse' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Available Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(application => (
            <div key={application.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold">
                      {application.job?.title || 'Job Title Not Available'}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(application.status)}
                    </span>
                  </div>
                  {application.job?.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{application.job.description}</p>
                  )}
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Submitted: {new Date(application.submitted_at).toLocaleDateString()}</p>
                    {application.reviewed_at && (
                      <p>Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}</p>
                    )}
                    {application.notes && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-700">Notes:</p>
                        <p className="text-gray-600">{application.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => navigate({ to: `/applications/${application.id}` })}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
