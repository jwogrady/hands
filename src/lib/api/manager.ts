import { supabase } from '../supabase'
import type { Application } from '../../types'

export async function getAllApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching all applications:', error)
    return []
  }

  return data || []
}
