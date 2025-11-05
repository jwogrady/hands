import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getJobs, deleteJob, updateJob } from '../../../lib/api/jobs'
import type { Job } from '../../../types'

export function JobPostingListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    if (user) {
      loadJobs()
    }
  }, [user, showInactive])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await getJobs(showInactive)
      setJobs(data)
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm('Are you sure you want to delete this job posting? This action cannot be undone.')
    ) {
      return
    }

    try {
      await deleteJob(id)
      await loadJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job posting. Please try again.')
    }
  }

  const handleToggleActive = async (job: Job) => {
    try {
      await updateJob(job.id, { is_active: !job.is_active })
      await loadJobs()
    } catch (error) {
      console.error('Error toggling job status:', error)
      alert('Failed to update job status. Please try again.')
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="mt-2 text-gray-600">Manage job postings and applications</p>
        </div>
        <button
          onClick={() => navigate({ to: '/jobs/create' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Create Job Posting
        </button>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={e => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show inactive job postings</span>
        </label>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">No job postings found.</p>
          <button
            onClick={() => navigate({ to: '/jobs/create' })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Job Posting
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className={`bg-white border rounded-lg p-6 ${!job.is_active ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{job.description}</p>
                  {job.requirements && (
                    <p className="mt-2 text-sm text-gray-500">
                      <strong>Requirements:</strong> {job.requirements}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Created: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate({ to: `/jobs/${job.id}/edit` })}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(job)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {job.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Delete
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
