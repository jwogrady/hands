import { supabase } from '../supabase'
import type { AddressHistory } from '../../types'

export async function getAddressHistory(userId: string): Promise<AddressHistory[]> {
  const { data, error } = await supabase
    .from('address_history')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching address history:', error)
    return []
  }

  return data || []
}

export async function addAddressHistory(
  userId: string,
  address: Omit<AddressHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<AddressHistory | null> {
  const { data, error } = await supabase
    .from('address_history')
    .insert({
      user_id: userId,
      ...address,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding address history:', error)
    return null
  }

  return data
}

export async function updateAddressHistory(
  id: string,
  updates: Partial<Omit<AddressHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<AddressHistory | null> {
  const { data, error } = await supabase
    .from('address_history')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating address history:', error)
    return null
  }

  return data
}

export async function deleteAddressHistory(id: string): Promise<boolean> {
  const { error } = await supabase.from('address_history').delete().eq('id', id)

  if (error) {
    console.error('Error deleting address history:', error)
    return false
  }

  return true
}
