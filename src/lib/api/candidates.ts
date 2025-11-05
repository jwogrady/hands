import { supabase } from '../supabase'
import type { Profile } from '../../types'

export async function getAllCandidates(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
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
