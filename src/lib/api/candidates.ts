import { supabase } from '../supabase'
import type { Profile } from '../../types'

export async function getAllCandidates(): Promise<Profile[]> {
  // First, get all user IDs that have the 'candidate' role
  const { data: candidateRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'candidate')

  if (rolesError) {
    console.error('Error fetching candidate roles:', rolesError)
    return []
  }

  const candidateUserIds = candidateRoles?.map(r => r.user_id) || []

  if (candidateUserIds.length === 0) {
    return []
  }

  // Then fetch profiles only for those candidate user IDs
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('user_id', candidateUserIds)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching candidates:', error)
    return []
  }

  return data || []
}

export async function getCandidate(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single()

  if (error) {
    console.error('Error fetching candidate:', error)
    return null
  }

  return data
}
