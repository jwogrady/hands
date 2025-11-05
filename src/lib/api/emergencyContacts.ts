import { supabase } from '../supabase'
import type { EmergencyContact } from '../../types'

export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching emergency contacts:', error)
    return []
  }

  return data || []
}

export async function addEmergencyContact(
  userId: string,
  contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<EmergencyContact | null> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert({
      user_id: userId,
      ...contact,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding emergency contact:', error)
    return null
  }

  return data
}

export async function updateEmergencyContact(
  id: string,
  updates: Partial<Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<EmergencyContact | null> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating emergency contact:', error)
    return null
  }

  return data
}

export async function deleteEmergencyContact(id: string): Promise<boolean> {
  const { error } = await supabase.from('emergency_contacts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting emergency contact:', error)
    return false
  }

  return true
}
