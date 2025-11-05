import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getApplication } from '../../../lib/api/applications'
import { getApplicationAnswers } from '../../../lib/api/applications'
import { getJob, getJobQuestions } from '../../../lib/api/jobs'
import { getProfile } from '../../../lib/api/profile'
import { supabase } from '../../../lib/supabase'
import type { Application, ApplicationAnswer, Job, JobQuestion, Profile } from '../../../types'

export function ApplicationReviewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = window.location.pathname
  // Extract applicationId from path like /manager/applications/$applicationId
  const pathParts = location.split('/').filter(Boolean)
  const applicationId = pathParts[2] // Third segment after 'manager' and 'applications'

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [candidate, setCandidate] = useState<Profile | null>(null)
  const [questions, setQuestions] = useState<JobQuestion[]>([])
  const [answers, setAnswers] = useState<ApplicationAnswer[]>([])
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (applicationId) {
      loadApplicationData()
    }
  }, [applicationId])

  const loadApplicationData = async () => {
    if (!applicationId) return
    setLoading(true)
    try {
      const app = await getApplication(applicationId)
      const answersData = await getApplicationAnswers(applicationId)

      if (app) {
        setApplication(app)
        setNotes(app.notes || '')

        const jobData = await getJob(app.job_id)
        if (jobData) {
          setJob(jobData)
          const questionsData = await getJobQuestions(app.job_id)
          setQuestions(questionsData)
        }

        const candidateData = await getProfile(app.candidate_id)
        setCandidate(candidateData)

        setAnswers(answersData)
      }
    } catch (error) {
      console.error('Error loading application data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: Application['status']) => {
    if (!application || !user) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id)

      if (error) throw error

      await loadApplicationData()
      alert('Application status updated successfully!')
    } catch (error) {
      console.error('Error updating application status:', error)
      alert('Failed to update application status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  }

  if (!application || !job || !candidate) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Application not found.</p>
      </div>
    )
  }

  const getAnswerForQuestion = (questionId: string): string => {
    const answer = answers.find(a => a.question_id === questionId)
    return answer?.answer || 'No answer provided'
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate({ to: '/manager/applications' })}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Applications
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Application Review</h1>
            <p className="text-gray-600">
              Job: <strong>{job.title}</strong>
            </p>
            <p className="text-gray-600">
              Candidate: <strong>{candidate.full_name || candidate.email}</strong>
            </p>
            <p className="text-gray-600">
              Submitted: {new Date(application.submitted_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded ${
              application.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : application.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : application.status === 'under_review'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Candidate Profile Link */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            View complete candidate profile for full details including employment history,
            background questions, documents, and authorizations.
          </p>
          <button
            onClick={() => navigate({ to: `/manager/candidates/${candidate.user_id}` })}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Candidate Profile →
          </button>
        </div>

        {/* Job-Specific Questions and Answers */}
        {questions.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Application Answers</h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <p className="text-gray-700">{getAnswerForQuestion(question.id)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Review Actions */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Review & Decision</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any notes about this application..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusUpdate('under_review')}
              disabled={updating || application.status === 'under_review'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Under Review
            </button>
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating || application.status === 'approved'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve Application
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating || application.status === 'rejected'}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Application
            </button>
            <button
              onClick={() => handleStatusUpdate('more_info_requested')}
              disabled={updating || application.status === 'more_info_requested'}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request More Info
            </button>
          </div>

          {application.reviewed_at && (
            <p className="mt-4 text-sm text-gray-500">
              Last reviewed: {new Date(application.reviewed_at).toLocaleString()}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
