import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getUserRoles } from '../../../lib/api/userRoles'
import { getJob, getJobQuestions } from '../../../lib/api/jobs'
import { createApplication, upsertApplicationAnswer } from '../../../lib/api/applications'
import type { Job, JobQuestion } from '../../../types'

export function JobDetailsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = window.location.pathname
  // Extract jobId from path like /jobs/$jobId/apply or /jobs/$jobId
  const pathParts = location.split('/').filter(Boolean)
  const jobId = pathParts[1] // Second segment after 'jobs'

  const [loading, setLoading] = useState(true)
  const [isManager, setIsManager] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [questions, setQuestions] = useState<JobQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (jobId && user) {
      checkUserRole()
      loadJobDetails()
    } else if (jobId) {
      loadJobDetails()
    }
  }, [jobId, user])

  const checkUserRole = async () => {
    if (!user) return
    try {
      const roles = await getUserRoles(user.id)
      const managerRole = roles.find(role => role.role === 'manager')
      setIsManager(!!managerRole)
    } catch (error) {
      console.error('Error checking user role:', error)
    }
  }

  const loadJobDetails = async () => {
    if (!jobId) return
    setLoading(true)
    try {
      const jobData = await getJob(jobId)
      if (jobData) {
        setJob(jobData)
        const jobQuestions = await getJobQuestions(jobId)
        setQuestions(jobQuestions)

        // Initialize answers with empty strings
        const initialAnswers: Record<string, string> = {}
        jobQuestions.forEach(q => {
          initialAnswers[q.id] = ''
        })
        setAnswers(initialAnswers)
      }
    } catch (error) {
      console.error('Error loading job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !jobId) return

    // Validate required questions
    const requiredQuestions = questions.filter(q => q.required)
    const missingAnswers = requiredQuestions.filter(
      q => !answers[q.id] || answers[q.id].trim() === ''
    )

    if (missingAnswers.length > 0) {
      alert('Please answer all required questions before submitting.')
      return
    }

    setSubmitting(true)
    try {
      // Create application
      const application = await createApplication(user.id, jobId)
      if (!application) {
        throw new Error('Failed to create application')
      }

      // Save answers
      for (const question of questions) {
        if (answers[question.id] && answers[question.id].trim() !== '') {
          await upsertApplicationAnswer(application.id, question.id, answers[question.id])
        }
      }

      setHasApplied(true)
      setTimeout(() => {
        navigate({ to: '/applications' })
      }, 2000)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500">Job not found.</p>
      </div>
    )
  }

  // Show funny message for managers trying to apply
  if (isManager) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hold up there, boss! 👔</h2>
          <p className="text-lg text-gray-700 mb-4">
            You're trying to apply for your own job posting? That's like trying to hire yourself!
          </p>
          <p className="text-gray-600 mb-6">
            Managers don't apply for jobs—they create them, review applications, and make the hiring
            decisions. You're on the other side of the desk now! 😄
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate({ to: '/jobs' })}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Manage Job Postings
            </button>
            <button
              onClick={() => navigate({ to: '/manager/applications' })}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Review Applications
            </button>
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (hasApplied) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Application Submitted!</h2>
          <p className="text-green-700">Your application has been successfully submitted.</p>
          <p className="text-sm text-green-600 mt-2">Redirecting to your applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate({ to: '/jobs/browse' })}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Jobs
      </button>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Application Questions</h2>

          {questions.map((question, index) => (
            <div key={question.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {index + 1}. {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {question.question_type === 'text' && (
                <input
                  type="text"
                  required={question.required}
                  value={answers[question.id] || ''}
                  onChange={e => handleAnswerChange(question.id, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.question_type === 'textarea' && (
                <textarea
                  required={question.required}
                  value={answers[question.id] || ''}
                  onChange={e => handleAnswerChange(question.id, e.target.value)}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.question_type === 'select' && question.options && (
                <select
                  required={question.required}
                  value={answers[question.id] || ''}
                  onChange={e => handleAnswerChange(question.id, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select an option...</option>
                  {question.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {question.question_type === 'checkbox' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={answers[question.id]?.includes(option) || false}
                        onChange={e => {
                          const current = answers[question.id]?.split(',').filter(Boolean) || []
                          if (e.target.checked) {
                            handleAnswerChange(question.id, [...current, option].join(','))
                          } else {
                            handleAnswerChange(
                              question.id,
                              current.filter(opt => opt !== option).join(',')
                            )
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate({ to: '/jobs/browse' })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}

      {questions.length === 0 && (
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            There are no additional questions for this job posting.
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Apply Now'}
          </button>
        </div>
      )}
    </div>
  )
}
