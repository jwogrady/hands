import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../../../lib/api/emergencyContacts'
import type { EmergencyContact } from '../../../types'

export function EmergencyContactsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({
    full_name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    relationship: '',
    phone: '',
  })

  const MAX_CONTACTS = 3

  useEffect(() => {
    if (user) {
      loadContacts()
    }
  }, [user])

  const loadContacts = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getEmergencyContacts(user.id)
      setContacts(data)
    } catch (error) {
      console.error('Error loading emergency contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EmergencyContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    if (contacts.length >= MAX_CONTACTS) {
      alert(`Maximum ${MAX_CONTACTS} emergency contacts allowed.`)
      return
    }
    setEditing('new')
    setFormData({
      full_name: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      relationship: '',
      phone: '',
    })
  }

  const handleEdit = (contact: EmergencyContact) => {
    setEditing(contact.id)
    setFormData(contact)
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const data = {
        ...formData,
        order: editing === 'new' ? contacts.length : formData.order || 0,
      } as Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>

      if (editing === 'new') {
        await addEmergencyContact(user.id, data)
      } else if (editing) {
        await updateEmergencyContact(editing, data)
      }

      await loadContacts()
      setEditing(null)
      setFormData({})
    } catch (error) {
      console.error('Error saving emergency contact:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) return

    try {
      await deleteEmergencyContact(id)
      await loadContacts()
    } catch (error) {
      console.error('Error deleting emergency contact:', error)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <p className="mt-2 text-gray-600">
          Please provide up to 3 emergency contacts. At least one contact is required.
        </p>
      </div>

      {editing === 'new' && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Add Emergency Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name || ''}
                onChange={e => handleChange('full_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                value={formData.address_street || ''}
                onChange={e => handleChange('address_street', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                required
                value={formData.address_city || ''}
                onChange={e => handleChange('address_city', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State *</label>
              <input
                type="text"
                required
                value={formData.address_state || ''}
                onChange={e => handleChange('address_state', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
              <input
                type="text"
                required
                value={formData.address_zip || ''}
                onChange={e => handleChange('address_zip', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship *</label>
              <input
                type="text"
                required
                value={formData.relationship || ''}
                onChange={e => handleChange('relationship', e.target.value)}
                placeholder="e.g., Spouse, Parent, Friend"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={e => handleChange('phone', e.target.value)}
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
      )}

      <div className="space-y-4">
        {contacts.length === 0 && editing !== 'new' && (
          <p className="text-gray-500 italic">No emergency contacts added yet.</p>
        )}

        {contacts.map(contact => (
          <div key={contact.id}>
            {editing === contact.id ? (
              <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Edit Emergency Contact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name || ''}
                      onChange={e => handleChange('full_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address_street || ''}
                      onChange={e => handleChange('address_street', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.address_city || ''}
                      onChange={e => handleChange('address_city', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.address_state || ''}
                      onChange={e => handleChange('address_state', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.address_zip || ''}
                      onChange={e => handleChange('address_zip', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.relationship || ''}
                      onChange={e => handleChange('relationship', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone || ''}
                      onChange={e => handleChange('phone', e.target.value)}
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
            ) : (
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {contact.address_city}, {contact.address_state} {contact.address_zip}
                    </p>
                    <p className="text-sm text-gray-600">Relationship: {contact.relationship}</p>
                    <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
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
      </div>

      {contacts.length < MAX_CONTACTS && editing !== 'new' && (
        <button
          onClick={handleAdd}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
        >
          + Add Emergency Contact
        </button>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => navigate({ to: '/profile/background-questions' })}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate({ to: '/profile/documents' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue to Documents →
        </button>
      </div>
    </div>
  )
}
