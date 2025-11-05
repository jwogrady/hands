import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getJobs } from '../../../lib/api/jobs'
import type { Job } from '../../../types'

export function JobBrowsePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await getJobs(false) // Only active jobs
      setJobs(data)
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requirements && job.requirements.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Available Jobs</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search jobs by title, description, or requirements..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">
            {searchTerm
              ? 'No jobs found matching your search.'
              : 'No job postings available at this time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  {job.requirements && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                      <p className="text-sm text-gray-600">{job.requirements}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => navigate({ to: `/jobs/${job.id}/public` })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
