import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getEmploymentHistory,
  addEmploymentHistory,
  updateEmploymentHistory,
  deleteEmploymentHistory,
} from '../../../lib/api/employmentHistory'
import { DatePicker } from '../../../components/ui/DatePicker'
import type { EmploymentHistory } from '../../../types'

export function EmploymentHistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EmploymentHistory>>({
    company_name: '',
    company_address_street: '',
    company_address_city: '',
    company_address_state: '',
    company_address_zip: '',
    supervisor_name: '',
    supervisor_phone: '',
    supervisor_email: '',
    start_date: '',
    end_date: '',
    reason_for_leaving: '',
    cdl_required: false,
    is_cdl_employment: false,
  })

  const loadEmploymentHistory = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const allHistory = await getEmploymentHistory(user.id)
      // Only get non-CDL employment (last 3 years)
      const regularEmployment = allHistory.filter(emp => !emp.is_cdl_employment)
      setEmploymentHistory(regularEmployment)
    } catch (error) {
      console.error('Error loading employment history:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadEmploymentHistory()
    }
  }, [user, loadEmploymentHistory])

  const handleChange = (field: keyof EmploymentHistory, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    setEditing('new')
    setFormData({
      company_name: '',
      company_address_street: '',
      company_address_city: '',
      company_address_state: '',
      company_address_zip: '',
      supervisor_name: '',
      supervisor_phone: '',
      supervisor_email: '',
      start_date: '',
      end_date: '',
      reason_for_leaving: '',
      cdl_required: false,
      is_cdl_employment: false,
    })
  }

  const handleEdit = (employment: EmploymentHistory) => {
    setEditing(employment.id)
    setFormData(employment)
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // Validate required fields
      if (!formData.company_name || !formData.start_date) {
        alert('Please fill in all required fields (Company Name and Start Date)')
        return
      }

      // Clean up the data - ensure dates are in YYYY-MM-DD format
      // start_date is required, so it should already be validated above
      // For optional fields, convert empty strings to null
      const data = {
        company_name: formData.company_name.trim(),
        start_date: formData.start_date, // Required field, already validated
        end_date: formData.end_date || null,
        company_address_street: formData.company_address_street || null,
        company_address_city: formData.company_address_city || null,
        company_address_state: formData.company_address_state || null,
        company_address_zip: formData.company_address_zip || null,
        supervisor_name: formData.supervisor_name || null,
        supervisor_phone: formData.supervisor_phone || null,
        supervisor_email: formData.supervisor_email || null,
        reason_for_leaving: formData.reason_for_leaving || null,
        is_cdl_employment: false, // Regular employment is never CDL
        cdl_required: formData.cdl_required || false,
      } as Omit<EmploymentHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>

      console.log('Submitting employment data:', data)

      if (editing === 'new') {
        await addEmploymentHistory(user.id, data)
      } else if (editing) {
        await updateEmploymentHistory(editing, data)
      }

      await loadEmploymentHistory()
      setEditing(null)
      setFormData({
        company_name: '',
        company_address_street: '',
        company_address_city: '',
        company_address_state: '',
        company_address_zip: '',
        supervisor_name: '',
        supervisor_phone: '',
        supervisor_email: '',
        start_date: '',
        end_date: '',
        reason_for_leaving: '',
        cdl_required: false,
        is_cdl_employment: false,
      })
    } catch (error: unknown) {
      console.error('Error saving employment history:', error)
      const errorMessage =
        (error instanceof Error && error.message) ||
        (typeof error === 'object' &&
          error !== null &&
          'error' in error &&
          typeof error.error === 'object' &&
          error.error !== null &&
          'message' in error.error &&
          typeof error.error.message === 'string' &&
          error.error.message) ||
        (typeof error === 'string' ? error : JSON.stringify(error)) ||
        'Unknown error'
      console.error('Full error details:', JSON.stringify(error, null, 2))
      alert(`Failed to save employment history: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employment record?')) return

    try {
      await deleteEmploymentHistory(id)
      await loadEmploymentHistory()
    } catch (error) {
      console.error('Error deleting employment history:', error)
    }
  }

  const renderEmploymentForm = () => (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        {editing === 'new' ? 'Add' : 'Edit'} Employment Record
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Company Name *</label>
          <input
            type="text"
            required
            value={formData.company_name || ''}
            onChange={e => handleChange('company_name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Company Address Street</label>
          <input
            type="text"
            value={formData.company_address_street || ''}
            onChange={e => handleChange('company_address_street', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.company_address_city || ''}
            onChange={e => handleChange('company_address_city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={formData.company_address_state || ''}
            onChange={e => handleChange('company_address_state', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            value={formData.company_address_zip || ''}
            onChange={e => handleChange('company_address_zip', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supervisor Name</label>
          <input
            type="text"
            value={formData.supervisor_name || ''}
            onChange={e => handleChange('supervisor_name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supervisor Phone</label>
          <input
            type="tel"
            value={formData.supervisor_phone || ''}
            onChange={e => handleChange('supervisor_phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supervisor Email</label>
          <input
            type="email"
            value={formData.supervisor_email || ''}
            onChange={e => handleChange('supervisor_email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <DatePicker
            label="Start Date"
            value={formData.start_date || ''}
            onChange={value => handleChange('start_date', value)}
            required
            max={formData.end_date || new Date().toISOString().split('T')[0]}
            placeholder="Select start date"
          />
        </div>

        <div>
          <DatePicker
            label="End Date"
            value={formData.end_date || ''}
            onChange={value => handleChange('end_date', value)}
            min={formData.start_date}
            max={new Date().toISOString().split('T')[0]}
            placeholder="Select end date (leave blank if current)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Reason for Leaving</label>
          <textarea
            value={formData.reason_for_leaving || ''}
            onChange={e => handleChange('reason_for_leaving', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.cdl_required || false}
              onChange={e => {
                handleChange('cdl_required', e.target.checked)

                // When checked, save current form data and redirect to CDL form prefilled
                if (e.target.checked) {
                  // Preserve all current form data
                  const prefilledData = {
                    ...formData,
                    cdl_required: true,
                    is_cdl_employment: true,
                  }

                  // Save form data to sessionStorage for prefilling
                  sessionStorage.setItem('cdlPrefillData', JSON.stringify(prefilledData))

                  // Navigate to CDL driving experience page
                  navigate({ to: '/profile/cdl-driving-experience' })
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">CDL was required for this position</span>
          </label>
          {formData.cdl_required && (
            <p className="mt-2 text-sm text-blue-600">
              ✓ After saving, add this to your CDL Driving Experience section
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  )

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Employment History</h1>
        <p className="mt-2 text-gray-600">
          Please provide your employment history for the last 3 years (non-CDL employment).
        </p>
        <p className="mt-1 text-sm text-gray-500">
          For CDL driving experience, please use the{' '}
          <button
            onClick={() => navigate({ to: '/profile/cdl-driving-experience' })}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            CDL Driving Experience
          </button>{' '}
          section.
        </p>
      </div>

      {/* Last 3 Years Employment */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Last 3 Years (All Employment)</h2>
          {editing !== 'new' && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Add Employment
            </button>
          )}
        </div>

        {editing === 'new' && renderEmploymentForm()}

        {employmentHistory.length === 0 && editing !== 'new' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No employment history added yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              If you don't have employment history for the last 3 years, that's okay. You can skip
              this section or add any work experience you do have.
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Add Employment Record
            </button>
          </div>
        )}

        {employmentHistory.map(employment => (
          <div key={employment.id}>
            {editing === employment.id ? (
              renderEmploymentForm()
            ) : (
              <div className="bg-white border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{employment.company_name}</h3>
                    <p className="text-sm text-gray-600">
                      {employment.company_address_city && employment.company_address_state && (
                        <>
                          {employment.company_address_city}, {employment.company_address_state}
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(employment.start_date).toLocaleDateString()} -{' '}
                      {employment.end_date
                        ? new Date(employment.end_date).toLocaleDateString()
                        : 'Present'}
                    </p>
                    {employment.reason_for_leaving && (
                      <p className="text-sm text-gray-600 mt-2">
                        Reason: {employment.reason_for_leaving}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(employment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="flex justify-end">
        <button
          onClick={() => navigate({ to: '/profile/cdl-driving-experience' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue to CDL Driving Experience →
        </button>
      </div>
    </div>
  )
}
