import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { updateProfile } from '../../../lib/api/profile'
import type { ProfileFormData } from '../../../types'

export function ProfileCreationPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    full_name: '',
    email: user?.email || '',
    phone: '',
    ssn: '',
    date_of_birth: '',
    present_address_street: '',
    present_address_city: '',
    present_address_state: '',
    present_address_zip: '',
    cdl_number: '',
    cdl_state: '',
    cdl_expiration_date: '',
    driving_experience_years: 0,
    driving_experience_miles: 0,
    driving_experience_equipment: [],
  })

  const handleChange = (field: keyof ProfileFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await updateProfile(user.id, formData as ProfileFormData)
      navigate({ to: '/profile/employment-history' })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4" data-step="1">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  required
                  value={formData.full_name || ''}
                  onChange={e => handleChange('full_name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
                  SSN *
                </label>
                <input
                  type="text"
                  id="ssn"
                  required
                  value={formData.ssn || ''}
                  onChange={e => handleChange('ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  required
                  value={formData.date_of_birth || ''}
                  onChange={e => handleChange('date_of_birth', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4" data-step="2">
            <h2 className="text-2xl font-bold">Present Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="present_address_street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="present_address_street"
                  required
                  value={formData.present_address_street || ''}
                  onChange={e => handleChange('present_address_street', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="present_address_city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="present_address_city"
                  required
                  value={formData.present_address_city || ''}
                  onChange={e => handleChange('present_address_city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="present_address_state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="present_address_state"
                  required
                  value={formData.present_address_state || ''}
                  onChange={e => handleChange('present_address_state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="present_address_zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="present_address_zip"
                  required
                  value={formData.present_address_zip || ''}
                  onChange={e => handleChange('present_address_zip', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4" data-step="3">
            <h2 className="text-2xl font-bold">CDL Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cdl_number" className="block text-sm font-medium text-gray-700">
                  CDL Number *
                </label>
                <input
                  type="text"
                  id="cdl_number"
                  required
                  value={formData.cdl_number || ''}
                  onChange={e => handleChange('cdl_number', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="cdl_state" className="block text-sm font-medium text-gray-700">
                  CDL State *
                </label>
                <input
                  type="text"
                  id="cdl_state"
                  required
                  value={formData.cdl_state || ''}
                  onChange={e => handleChange('cdl_state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="cdl_expiration_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  CDL Expiration Date *
                </label>
                <input
                  type="date"
                  id="cdl_expiration_date"
                  required
                  value={formData.cdl_expiration_date || ''}
                  onChange={e => handleChange('cdl_expiration_date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4" data-step="4">
            <h2 className="text-2xl font-bold">Driving Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="driving_experience_years"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Driving Experience *
                </label>
                <input
                  type="number"
                  id="driving_experience_years"
                  required
                  min="0"
                  value={formData.driving_experience_years || 0}
                  onChange={e =>
                    handleChange('driving_experience_years', parseInt(e.target.value, 10))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="driving_experience_miles"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Miles Driven *
                </label>
                <input
                  type="number"
                  id="driving_experience_miles"
                  required
                  min="0"
                  value={formData.driving_experience_miles || 0}
                  onChange={e =>
                    handleChange('driving_experience_miles', parseInt(e.target.value, 10))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Types *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Straight Truck',
                    'Tractor-Trailer',
                    'Flatbed',
                    'Refrigerated',
                    'Tanker',
                    'Double/Triple',
                    'Bus',
                    'Other',
                  ].map(equipment => (
                    <label key={equipment} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.driving_experience_equipment?.includes(equipment) || false
                        }
                        onChange={e => {
                          const current = formData.driving_experience_equipment || []
                          if (e.target.checked) {
                            handleChange('driving_experience_equipment', [...current, equipment])
                          } else {
                            handleChange(
                              'driving_experience_equipment',
                              current.filter(item => item !== equipment)
                            )
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              setStep(Math.max(1, step - 1))
            }}
            disabled={step === 1}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                // Validate current step before proceeding - only check inputs in the rendered step
                const form = e.currentTarget.closest('form')
                if (form) {
                  // Get the container for the current step using data attribute
                  const stepContainer = form.querySelector(`[data-step="${step}"]`)
                  if (stepContainer) {
                    // Check validity of only the visible required fields in current step
                    const inputs = stepContainer.querySelectorAll(
                      'input[required], textarea[required], select[required]'
                    )
                    let isValid = true
                    let firstInvalid: HTMLElement | null = null

                    inputs.forEach(input => {
                      if (
                        input instanceof HTMLInputElement ||
                        input instanceof HTMLTextAreaElement ||
                        input instanceof HTMLSelectElement
                      ) {
                        if (!input.checkValidity()) {
                          isValid = false
                          if (!firstInvalid) {
                            firstInvalid = input
                          }
                        }
                      }
                    })

                    if (isValid) {
                      setStep(step + 1)
                    } else if (firstInvalid) {
                      // Focus and report validity on first invalid field
                      firstInvalid.focus()
                      if (
                        firstInvalid instanceof HTMLInputElement ||
                        firstInvalid instanceof HTMLTextAreaElement ||
                        firstInvalid instanceof HTMLSelectElement
                      ) {
                        firstInvalid.reportValidity()
                      }
                    }
                  } else {
                    // Fallback: just proceed if we can't find the container
                    setStep(step + 1)
                  }
                }
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
