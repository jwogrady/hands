import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getProfile, updateProfile } from '../../../lib/api/profile'
import {
  getAddressHistory,
  addAddressHistory,
  updateAddressHistory,
} from '../../../lib/api/addressHistory'
import { DatePicker } from '../../../components/ui/DatePicker'
import type { ProfileFormData, AddressHistory } from '../../../types'

export function ProfileCreationPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [presentAddressStartDate, setPresentAddressStartDate] = useState<string>('')
  const [addressHistory, setAddressHistory] = useState<AddressHistory[]>([])
  const [needsPreviousAddresses, setNeedsPreviousAddresses] = useState(false)
  const [previousAddressForm, setPreviousAddressForm] = useState<Partial<AddressHistory>>({
    street: '',
    city: '',
    state: '',
    zip: '',
    start_date: '',
    end_date: '',
  })
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
  })
  const [hasCDL, setHasCDL] = useState<boolean | null>(null)
  const [plansCDLTraining, setPlansCDLTraining] = useState<boolean | null>(null)

  // Check if current address is less than 3 years - if so, show previous address form
  const checkIfNeedsPreviousAddresses = useCallback((moveInDate: string): boolean => {
    if (!moveInDate) return false

    const moveIn = new Date(moveInDate)
    const today = new Date()

    // Calculate years between move-in and today
    let yearsDiff = today.getFullYear() - moveIn.getFullYear()
    const monthDiff = today.getMonth() - moveIn.getMonth()

    // Adjust if we haven't reached the anniversary month yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < moveIn.getDate())) {
      yearsDiff -= 1
    }

    // Add fractional year for remaining months
    const monthsRemaining = monthDiff < 0 ? monthDiff + 12 : monthDiff
    const fractionalYear = monthsRemaining / 12
    const totalYears = yearsDiff + fractionalYear

    return totalYears < 3
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      const profile = await getProfile(user.id)
      const addresses = await getAddressHistory(user.id)
      setAddressHistory(addresses)

      // Find current address (no end_date) and set start date
      const currentAddress = addresses.find(addr => !addr.end_date)
      if (currentAddress) {
        setPresentAddressStartDate(currentAddress.start_date)
        // Check if we need previous addresses based on current address date
        setNeedsPreviousAddresses(checkIfNeedsPreviousAddresses(currentAddress.start_date))
      }

      // Prefill move-out date with most recent previous address's move-in date if form is empty
      const previousAddresses = addresses
        .filter(addr => addr.end_date !== null)
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      if (
        previousAddresses.length > 0 &&
        !previousAddressForm.street &&
        !previousAddressForm.end_date
      ) {
        setPreviousAddressForm(prev => ({
          ...prev,
          end_date: previousAddresses[0].start_date,
        }))
      }

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          ssn: profile.ssn || '',
          date_of_birth: profile.date_of_birth || '',
          present_address_street: profile.present_address_street || '',
          present_address_city: profile.present_address_city || '',
          present_address_state: profile.present_address_state || '',
          present_address_zip: profile.present_address_zip || '',
          cdl_number: profile.cdl_number || '',
          cdl_state: profile.cdl_state || '',
          cdl_expiration_date: profile.cdl_expiration_date || '',
        })
        // Profile is submitted if profile_completed_at is set
        setIsSubmitted(!!profile.profile_completed_at)
      }
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, checkIfNeedsPreviousAddresses])

  const handleChange = (field: keyof ProfileFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const saveCurrentStep = async (stepNumber: number): Promise<boolean> => {
    if (!user) return false

    try {
      // Determine which fields to save based on the current step
      const stepFields: Partial<ProfileFormData> = {}

      switch (stepNumber) {
        case 1: // Personal Information
          stepFields.full_name = formData.full_name || ''
          stepFields.phone = formData.phone || ''
          stepFields.ssn = formData.ssn || ''
          stepFields.date_of_birth = formData.date_of_birth || ''
          // Email is read-only, so we don't include it
          break
        case 2: // Present Address
          stepFields.present_address_street = formData.present_address_street || ''
          stepFields.present_address_city = formData.present_address_city || ''
          stepFields.present_address_state = formData.present_address_state || ''
          stepFields.present_address_zip = formData.present_address_zip || ''

          break
        case 3: // CDL Information
          if (hasCDL) {
            // Save CDL info if they have a CDL
            stepFields.cdl_number = formData.cdl_number || ''
            stepFields.cdl_state = formData.cdl_state || ''
            stepFields.cdl_expiration_date = formData.cdl_expiration_date || ''
          }
          // Note: plansCDLTraining and expected completion date would need to be added to the schema
          // For now, we'll just save the CDL info if they have it
          break
      }

      await updateProfile(user.id, stepFields)

      return true
    } catch (error) {
      console.error('Error saving profile step:', error)
      return false
    }
  }

  const handleAddPreviousAddress = async () => {
    if (!user) return

    if (
      !previousAddressForm.street ||
      !previousAddressForm.city ||
      !previousAddressForm.state ||
      !previousAddressForm.zip ||
      !previousAddressForm.start_date ||
      !previousAddressForm.end_date
    ) {
      alert('Please fill in all address fields and dates')
      return
    }

    try {
      await addAddressHistory(user.id, {
        street: previousAddressForm.street!,
        city: previousAddressForm.city!,
        state: previousAddressForm.state!,
        zip: previousAddressForm.zip!,
        start_date: previousAddressForm.start_date!,
        end_date: previousAddressForm.end_date!,
      })

      // Reload address history
      const updatedAddresses = await getAddressHistory(user.id)
      setAddressHistory(updatedAddresses)

      // Reset form, prefilling move-out date with the previous address's move-in date for next entry
      const moveInDate = previousAddressForm.start_date
      setPreviousAddressForm({
        street: '',
        city: '',
        state: '',
        zip: '',
        start_date: '',
        end_date: moveInDate || '', // Prefill with previous move-in date
      })
    } catch (error) {
      console.error('Error adding previous address:', error)
      alert('Error adding address. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Save the final step before navigating
      await saveCurrentStep(3)
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
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.full_name || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="full_name"
                    required
                    value={formData.full_name || ''}
                    onChange={e => handleChange('full_name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                  {user?.email || 'Not available'}
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.phone || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
                  SSN *
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.ssn ? '•••-••-' + formData.ssn.slice(-4) : 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="ssn"
                    required
                    value={formData.ssn || ''}
                    onChange={e => handleChange('ssn', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.date_of_birth
                      ? new Date(formData.date_of_birth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not provided'}
                  </div>
                ) : (
                  <DatePicker
                    id="date_of_birth"
                    value={formData.date_of_birth || ''}
                    onChange={value => handleChange('date_of_birth', value)}
                    required
                    max={new Date().toISOString().split('T')[0]} // Can't be in the future
                    placeholder="Select date of birth"
                  />
                )}
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
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.present_address_street || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="present_address_street"
                    required
                    value={formData.present_address_street || ''}
                    onChange={e => handleChange('present_address_street', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="present_address_city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City *
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.present_address_city || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="present_address_city"
                    required
                    value={formData.present_address_city || ''}
                    onChange={e => handleChange('present_address_city', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="present_address_state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State *
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.present_address_state || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="present_address_state"
                    required
                    value={formData.present_address_state || ''}
                    onChange={e => handleChange('present_address_state', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="present_address_zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code *
                </label>
                {isSubmitted ? (
                  <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                    {formData.present_address_zip || 'Not provided'}
                  </div>
                ) : (
                  <input
                    type="text"
                    id="present_address_zip"
                    required
                    value={formData.present_address_zip || ''}
                    onChange={e => handleChange('present_address_zip', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <DatePicker
                  label="How long have you lived here? (Month/Year) *"
                  value={presentAddressStartDate}
                  onChange={async value => {
                    setPresentAddressStartDate(value)

                    // When date is selected and we have address info, save to address_history
                    if (
                      value &&
                      user &&
                      formData.present_address_street &&
                      formData.present_address_city
                    ) {
                      // Check if we need previous addresses (current < 3 years)
                      const needsPrevious = checkIfNeedsPreviousAddresses(value)
                      setNeedsPreviousAddresses(needsPrevious)

                      // Update or add the present address
                      const currentAddresses = await getAddressHistory(user.id)

                      // Find if present address already exists in address_history
                      const existingAddress = currentAddresses.find(
                        addr =>
                          addr.street === formData.present_address_street &&
                          addr.city === formData.present_address_city &&
                          addr.state === formData.present_address_state &&
                          addr.zip === formData.present_address_zip &&
                          !addr.end_date
                      )

                      if (existingAddress) {
                        // Update existing address with new start date
                        await updateAddressHistory(existingAddress.id, {
                          start_date: value,
                        })
                      } else {
                        // Add new address to history
                        await addAddressHistory(user.id, {
                          street: formData.present_address_street || '',
                          city: formData.present_address_city || '',
                          state: formData.present_address_state || '',
                          zip: formData.present_address_zip || '',
                          start_date: value,
                          end_date: null,
                        })
                      }

                      // Reload address history
                      const updatedAddresses = await getAddressHistory(user.id)
                      setAddressHistory(updatedAddresses)

                      // If we need previous addresses and form is empty, prefill move-out date
                      if (needsPrevious && !previousAddressForm.end_date) {
                        const moveInDateObj = new Date(value)
                        const moveOutYear = moveInDateObj.getFullYear() - 1
                        const moveOutMonth = moveInDateObj.getMonth()
                        const moveOutDate = new Date(moveOutYear, moveOutMonth, 1)
                        const moveOutDateString = moveOutDate.toISOString().split('T')[0]
                        setPreviousAddressForm(prev => ({
                          ...prev,
                          end_date: moveOutDateString,
                        }))
                      }
                    }
                  }}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  placeholder="Select month/year"
                  monthYearOnly
                  disabled={isSubmitted}
                />
              </div>
            </div>

            {/* Show previous address form only if current address is less than 3 years */}
            {needsPreviousAddresses && !isSubmitted && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-4">
                  <strong>Previous addresses needed:</strong> Since you've lived at your current
                  address for less than 3 years, please add your previous addresses below.
                </p>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Previous Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={previousAddressForm.street || ''}
                        onChange={e =>
                          setPreviousAddressForm(prev => ({ ...prev, street: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        required
                        value={previousAddressForm.city || ''}
                        onChange={e =>
                          setPreviousAddressForm(prev => ({ ...prev, city: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State *</label>
                      <input
                        type="text"
                        required
                        value={previousAddressForm.state || ''}
                        onChange={e =>
                          setPreviousAddressForm(prev => ({ ...prev, state: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={previousAddressForm.zip || ''}
                        onChange={e =>
                          setPreviousAddressForm(prev => ({ ...prev, zip: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        label="Move-In Date (Month/Year) *"
                        value={previousAddressForm.start_date || ''}
                        onChange={value =>
                          setPreviousAddressForm(prev => ({ ...prev, start_date: value }))
                        }
                        required
                        max={previousAddressForm.end_date || new Date().toISOString().split('T')[0]}
                        placeholder="Select move-in month/year"
                        monthYearOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DatePicker
                        label="Move-Out Date (Month/Year) *"
                        value={previousAddressForm.end_date || ''}
                        onChange={value =>
                          setPreviousAddressForm(prev => ({ ...prev, end_date: value }))
                        }
                        required
                        min={previousAddressForm.start_date}
                        max={presentAddressStartDate || new Date().toISOString().split('T')[0]}
                        placeholder="Select move-out month/year"
                        monthYearOnly
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPreviousAddress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    Add Previous Address
                  </button>
                </div>

                {/* Show existing address history */}
                {addressHistory.filter(addr => addr.end_date !== null).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-yellow-300">
                    <h4 className="font-medium text-gray-900 mb-2">Address History</h4>
                    <div className="space-y-2">
                      {addressHistory
                        .filter(addr => addr.end_date !== null)
                        .sort(
                          (a, b) =>
                            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
                        )
                        .map((addr, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            {addr.street}, {addr.city}, {addr.state} {addr.zip} -{' '}
                            {new Date(addr.start_date).toLocaleDateString()} to{' '}
                            {new Date(addr.end_date!).toLocaleDateString()}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4" data-step="3">
            <h2 className="text-2xl font-bold">CDL Information</h2>

            {isSubmitted ? (
              // Read-only view when submitted
              <div className="space-y-4">
                {hasCDL ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CDL Number</label>
                      <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                        {formData.cdl_number || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CDL State</label>
                      <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                        {formData.cdl_state || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CDL Expiration Date
                      </label>
                      <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                        {formData.cdl_expiration_date
                          ? new Date(formData.cdl_expiration_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Not provided'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    {plansCDLTraining === true
                      ? 'Plans to complete CDL training'
                      : plansCDLTraining === false
                        ? 'Does not plan to complete CDL training'
                        : 'No CDL'}
                  </div>
                )}
              </div>
            ) : (
              // Editable form
              <div className="space-y-6">
                {/* Question 1: Do you have a CDL? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have a CDL? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="has_cdl"
                        checked={hasCDL === true}
                        onChange={() => {
                          setHasCDL(true)
                          setPlansCDLTraining(null)
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="has_cdl"
                        checked={hasCDL === false}
                        onChange={() => {
                          setHasCDL(false)
                          setPlansCDLTraining(null)
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* If yes, show CDL fields */}
                {hasCDL === true && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label
                        htmlFor="cdl_number"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                      <label
                        htmlFor="cdl_state"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                      <DatePicker
                        id="cdl_expiration_date"
                        label="CDL Expiration Date"
                        value={formData.cdl_expiration_date || ''}
                        onChange={value => handleChange('cdl_expiration_date', value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        placeholder="Select expiration date"
                      />
                    </div>
                  </div>
                )}

                {/* If no, ask if they plan to complete CDL training */}
                {hasCDL === false && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you plan to complete CDL training? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="plans_cdl_training"
                          checked={plansCDLTraining === true}
                          onChange={() => setPlansCDLTraining(true)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="plans_cdl_training"
                          checked={plansCDLTraining === false}
                          onChange={() => setPlansCDLTraining(false)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>

                    {/* If yes, ask for expected completion date */}
                    {plansCDLTraining === true && (
                      <div className="mt-4">
                        <DatePicker
                          id="cdl_expected_completion"
                          label="Expected Completion Date"
                          value={formData.cdl_expiration_date || ''}
                          onChange={value => handleChange('cdl_expiration_date', value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          placeholder="Select expected completion date"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        {!isSubmitted && (
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
            {step < 3 ? (
              <button
                type="button"
                onClick={async e => {
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
                        // Skip validation for hidden/disabled inputs or inputs not visible in the DOM
                        if (input.hasAttribute('hidden')) {
                          return
                        }

                        if (
                          input instanceof HTMLInputElement ||
                          input instanceof HTMLTextAreaElement ||
                          input instanceof HTMLSelectElement
                        ) {
                          // Skip disabled or hidden inputs
                          if (input.disabled || input.offsetParent === null) {
                            return
                          }

                          if (!input.checkValidity()) {
                            isValid = false
                            if (!firstInvalid) {
                              firstInvalid = input
                            }
                          }
                        }
                      })

                      if (isValid) {
                        // Save current step data before proceeding
                        setLoading(true)
                        const saved = await saveCurrentStep(step)

                        if (saved) {
                          setStep(step + 1)
                        } else {
                          // Show error if save failed
                          alert('Error saving your information. Please try again.')
                        }
                        setLoading(false)
                      } else if (firstInvalid) {
                        // Focus and report validity on first invalid field
                        const invalidInput = firstInvalid as
                          | HTMLInputElement
                          | HTMLTextAreaElement
                          | HTMLSelectElement
                        if (
                          invalidInput instanceof HTMLInputElement ||
                          invalidInput instanceof HTMLTextAreaElement ||
                          invalidInput instanceof HTMLSelectElement
                        ) {
                          invalidInput.focus()
                          invalidInput.reportValidity()
                        }
                      }
                    } else {
                      // Fallback: just proceed if we can't find the container
                      setStep(step + 1)
                    }
                  }
                }}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Next'}
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
        )}
      </form>
    </div>
  )
}
