import { supabase } from '../supabase'
import type { UserRole } from '../../types'

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    return null
  }

  return data
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', userId)

  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }

  return data || []
}
