import { supabase } from '../supabase'
import type { Authorization } from '../../types'

export async function getAuthorizations(userId: string): Promise<Authorization[]> {
  const { data, error } = await supabase
    .from('authorizations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching authorizations:', error)
    return []
  }

  return data || []
}

export async function signAuthorization(
  userId: string,
  authorizationType: Authorization['authorization_type']
): Promise<Authorization | null> {
  const { data, error } = await supabase
    .from('authorizations')
    .upsert(
      {
        user_id: userId,
        authorization_type: authorizationType,
        signed: true,
        signed_at: new Date().toISOString(),
        ip_address: null, // Can be set from client if needed
        user_agent: navigator.userAgent,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,authorization_type',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error signing authorization:', error)
    return null
  }

  return data
}
