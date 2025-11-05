import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getBackgroundQuestions,
  upsertBackgroundQuestion,
  BACKGROUND_QUESTIONS,
} from '../../../lib/api/backgroundQuestions'

export function BackgroundQuestionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, { answer: boolean; explanation: string }>>(
    {}
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      loadAnswers()
    }
  }, [user])

  const loadAnswers = async () => {
    if (!user) return
    setLoading(true)
    try {
      const existing = await getBackgroundQuestions(user.id)
      const answersMap: Record<number, { answer: boolean; explanation: string }> = {}
      existing.forEach(q => {
        answersMap[q.question_number] = {
          answer: q.answer,
          explanation: q.explanation || '',
        }
      })
      setAnswers(answersMap)
    } catch (error) {
      console.error('Error loading background questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionNumber: number, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: {
        answer,
        explanation: prev[questionNumber]?.explanation || '',
      },
    }))
  }

  const handleExplanationChange = (questionNumber: number, explanation: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: {
        answer: prev[questionNumber]?.answer || false,
        explanation,
      },
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const promises = Object.entries(answers).map(([questionNumber, data]) =>
        upsertBackgroundQuestion(
          user.id,
          parseInt(questionNumber, 10),
          data.answer,
          data.explanation || null
        )
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error saving background questions:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleContinue = async () => {
    await handleSave()
    navigate({ to: '/profile/emergency-contacts' })
  }

  const allAnswered = Object.keys(answers).length === BACKGROUND_QUESTIONS.length

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Background Questions</h1>
        <p className="mt-2 text-gray-600">
          Please answer all questions truthfully. If you answer "Yes" to any question, please
          provide a detailed explanation.
        </p>
      </div>

      <form className="space-y-6">
        {BACKGROUND_QUESTIONS.map((question, index) => {
          const questionNumber = index + 1
          const currentAnswer = answers[questionNumber]

          return (
            <div key={questionNumber} className="bg-white border rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {questionNumber}. {question}
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${questionNumber}`}
                      checked={currentAnswer?.answer === true}
                      onChange={() => handleAnswerChange(questionNumber, true)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${questionNumber}`}
                      checked={currentAnswer?.answer === false}
                      onChange={() => handleAnswerChange(questionNumber, false)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {currentAnswer?.answer === true && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide details:
                  </label>
                  <textarea
                    value={currentAnswer.explanation}
                    onChange={e => handleExplanationChange(questionNumber, e.target.value)}
                    required
                    rows={4}
                    placeholder="Please provide a detailed explanation..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )
        })}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: '/profile/employment-history' })}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !allAnswered}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={saving || !allAnswered}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Continue to Emergency Contacts →
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
