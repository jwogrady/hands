import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getCDLEmploymentHistory,
  addEmploymentHistory,
  updateEmploymentHistory,
  deleteEmploymentHistory,
} from '../../../lib/api/employmentHistory'
import { DatePicker } from '../../../components/ui/DatePicker'
import type { EmploymentHistory } from '../../../types'

export function CDLDrivingExperiencePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [cdlHistory, setCdlHistory] = useState<EmploymentHistory[]>([])
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
    cdl_required: true,
    is_cdl_employment: true,
  })

  const loadCDLHistory = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const cdlOnly = await getCDLEmploymentHistory(user.id)
      setCdlHistory(cdlOnly)
    } catch (error) {
      console.error('Error loading CDL employment history:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadCDLHistory()

      // Check for prefilled data from employment history page
      const prefillData = sessionStorage.getItem('cdlPrefillData')
      if (prefillData) {
        try {
          const data = JSON.parse(prefillData)
          setFormData({
            ...data,
            cdl_required: true,
            is_cdl_employment: true,
          })
          setEditing('new')
          sessionStorage.removeItem('cdlPrefillData')
        } catch (error) {
          console.error('Error parsing prefill data:', error)
        }
      }
    }
  }, [user, loadCDLHistory])

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
      cdl_required: true,
      is_cdl_employment: true,
    })
  }

  const handleEdit = (employment: EmploymentHistory) => {
    setEditing(employment.id)
    setFormData(employment)
  }

  const handleCancel = () => {
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
      cdl_required: true,
      is_cdl_employment: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const data = {
        ...formData,
        is_cdl_employment: true,
        cdl_required: true,
      } as Omit<EmploymentHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>

      if (editing === 'new') {
        await addEmploymentHistory(user.id, data)
      } else if (editing) {
        await updateEmploymentHistory(editing, data)
      }

      await loadCDLHistory()
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
        cdl_required: true,
        is_cdl_employment: true,
      })
    } catch (error) {
      console.error('Error saving CDL employment history:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this CDL employment record?')) return

    try {
      await deleteEmploymentHistory(id)
      await loadCDLHistory()
    } catch (error) {
      console.error('Error deleting CDL employment history:', error)
    }
  }

  const renderEmploymentForm = () => (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        {editing === 'new' ? 'Add' : 'Edit'} CDL Employment Record
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
          <label className="block text-sm font-medium text-gray-700">Company Address</label>
          <input
            type="text"
            value={formData.company_address_street || ''}
            onChange={e => handleChange('company_address_street', e.target.value)}
            placeholder="Street Address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            value={formData.company_address_city || ''}
            onChange={e => handleChange('company_address_city', e.target.value)}
            placeholder="City"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            value={formData.company_address_state || ''}
            onChange={e => handleChange('company_address_state', e.target.value)}
            placeholder="State"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            value={formData.company_address_zip || ''}
            onChange={e => handleChange('company_address_zip', e.target.value)}
            placeholder="ZIP Code"
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
        <h1 className="text-3xl font-bold">CDL Driving Experience</h1>
        <p className="mt-2 text-gray-600">
          Please provide your CDL driving experience for the last 7 years. This includes any
          employment where a Commercial Driver's License (CDL) was required.
        </p>
      </div>

      {/* 7 Years CDL Employment */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Last 7 Years (CDL Employment Only)</h2>
          {editing !== 'new' && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add CDL Employment
            </button>
          )}
        </div>

        {editing === 'new' && renderEmploymentForm()}

        {cdlHistory.length === 0 && editing !== 'new' && (
          <p className="text-gray-500 italic">No CDL employment history added yet.</p>
        )}

        {cdlHistory.map(employment => (
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

      {editing === null && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Continue to Dashboard →
          </button>
        </div>
      )}
    </div>
  )
}
