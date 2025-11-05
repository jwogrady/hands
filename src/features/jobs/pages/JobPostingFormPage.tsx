import { useState, useEffect } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getJob,
  createJob,
  updateJob,
  getJobQuestions,
  createJobQuestion,
  updateJobQuestion,
  deleteJobQuestion,
} from '../../../lib/api/jobs'
import type { Job, JobQuestion } from '../../../types'

export function JobPostingFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const router = useRouter()
  const location = router.state.location
  const jobId = location.pathname.includes('/edit') ? location.pathname.split('/')[2] : undefined
  const isEditing = !!jobId

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    is_active: true,
  })
  const [questions, setQuestions] = useState<JobQuestion[]>([])

  useEffect(() => {
    if (isEditing && jobId) {
      loadJob()
    }
  }, [jobId, isEditing])

  const loadJob = async () => {
    if (!jobId) return
    setLoading(true)
    try {
      const job = await getJob(jobId)
      if (job) {
        setFormData({
          title: job.title,
          description: job.description,
          requirements: job.requirements || '',
          is_active: job.is_active,
        })
        const jobQuestions = await getJobQuestions(jobId)
        setQuestions(jobQuestions)
      }
    } catch (error) {
      console.error('Error loading job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      let job: Job | null
      if (isEditing && jobId) {
        job = await updateJob(jobId, formData)
      } else {
        job = await createJob(user.id, formData)
      }

      if (job) {
        // Save questions
        for (const question of questions) {
          if (question.id.startsWith('new-')) {
            // New question
            await createJobQuestion({
              job_id: job.id,
              question: question.question,
              question_type: question.question_type,
              required: question.required,
              order: question.order,
              options: question.options,
            })
          } else {
            // Update existing question
            await updateJobQuestion(question.id, {
              question: question.question,
              question_type: question.question_type,
              required: question.required,
              order: question.order,
              options: question.options,
            })
          }
        }

        navigate({ to: '/jobs' })
      }
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job posting. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `new-${Date.now()}`,
        job_id: jobId || '',
        question: '',
        question_type: 'text',
        required: false,
        order: questions.length,
        options: null,
        created_at: new Date().toISOString(),
      },
    ])
  }

  const handleQuestionChange = (
    index: number,
    field: keyof JobQuestion,
    value: string | boolean | string[] | null
  ) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleDeleteQuestion = async (index: number) => {
    const question = questions[index]
    if (question && !question.id.startsWith('new-')) {
      await deleteJobQuestion(question.id)
    }
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return
    }

    const updated = [...questions]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    updated[index].order = index
    updated[newIndex].order = newIndex
    setQuestions(updated)
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Job Posting' : 'Create Job Posting'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., CDL Class A Driver"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={6}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe the job responsibilities, schedule, and benefits..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={e => handleChange('requirements', e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., CDL Class A, 2+ years experience, clean driving record..."
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => handleChange('is_active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Job posting is active</span>
            </label>
          </div>
        </div>

        {/* Job Questions Section */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job-Specific Questions</h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              + Add Question
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Add custom questions that candidates must answer when applying for this job.
          </p>

          {questions.length === 0 ? (
            <p className="text-gray-500 italic">No questions added yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(index, 'down')}
                        disabled={index === questions.length - 1}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={question.question}
                        onChange={e => handleQuestionChange(index, 'question', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your question..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type *
                        </label>
                        <select
                          value={question.question_type}
                          onChange={e =>
                            handleQuestionChange(index, 'question_type', e.target.value)
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select (Dropdown)</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={e =>
                              handleQuestionChange(index, 'required', e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                    </div>

                    {(question.question_type === 'select' ||
                      question.question_type === 'checkbox') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options (comma-separated) *
                        </label>
                        <input
                          type="text"
                          required
                          value={
                            question.options
                              ? Array.isArray(question.options)
                                ? question.options.join(', ')
                                : ''
                              : ''
                          }
                          onChange={e => {
                            const options = e.target.value
                              .split(',')
                              .map(opt => opt.trim())
                              .filter(opt => opt.length > 0)
                            handleQuestionChange(index, 'options', options)
                          }}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="e.g., Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/jobs' })}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Job Posting' : 'Create Job Posting'}
          </button>
        </div>
      </form>
    </div>
  )
}
