import { supabase } from '../supabase'
import type { EmploymentHistory } from '../../types'

export async function getEmploymentHistory(userId: string): Promise<EmploymentHistory[]> {
  const { data, error } = await supabase
    .from('employment_history')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching employment history:', error)
    return []
  }

  return data || []
}

export async function getCDLEmploymentHistory(userId: string): Promise<EmploymentHistory[]> {
  const { data, error } = await supabase
    .from('employment_history')
    .select('*')
    .eq('user_id', userId)
    .eq('is_cdl_employment', true)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching CDL employment history:', error)
    return []
  }

  return data || []
}

export async function addEmploymentHistory(
  userId: string,
  employment: Omit<EmploymentHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<EmploymentHistory | null> {
  console.log('addEmploymentHistory called with userId:', userId, 'employment:', employment)

  // Verify user is authenticated
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  if (!authUser || authUser.id !== userId) {
    const error = new Error('Authentication failed or user ID mismatch')
    console.error('Auth error:', error)
    throw error
  }

  const { data, error } = await supabase
    .from('employment_history')
    .insert({
      user_id: userId,
      ...employment,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding employment history:', error)
    console.error('Error code:', error.code, 'Error message:', error.message)
    console.error('Error details:', JSON.stringify(error, null, 2))
    console.error('Error hint:', error.hint)
    throw new Error(
      `Failed to save employment history: ${error.message}${error.hint ? ` (${error.hint})` : ''}`
    )
  }

  console.log('addEmploymentHistory success:', data)
  return data
}

export async function updateEmploymentHistory(
  id: string,
  updates: Partial<Omit<EmploymentHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<EmploymentHistory | null> {
  const { data, error } = await supabase
    .from('employment_history')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating employment history:', error)
    return null
  }

  return data
}

export async function deleteEmploymentHistory(id: string): Promise<boolean> {
  const { error } = await supabase.from('employment_history').delete().eq('id', id)

  if (error) {
    console.error('Error deleting employment history:', error)
    return false
  }

  return true
}
