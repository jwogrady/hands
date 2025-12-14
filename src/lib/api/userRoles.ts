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
  console.log('getUserRoles called with userId:', userId)

  // Verify session exists (for debugging)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  console.log('Session exists:', !!session, 'Session user ID:', session?.user?.id)

  if (!session) {
    console.warn('getUserRoles: No session, query may be blocked by RLS')
  }

  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', userId)

  if (error) {
    console.error('Error fetching user roles:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error details:', JSON.stringify(error, null, 2))

    // If it's an RLS error, log more details
    if (
      error.code === 'PGRST301' ||
      error.message?.includes('RLS') ||
      error.message?.includes('permission')
    ) {
      console.error("RLS blocked query - auth.uid() is likely NULL or doesn't match user_id")
      console.error("This usually means the JWT token isn't being passed correctly to PostgREST")
    }

    return []
  }

  console.log('getUserRoles result:', data, 'count:', data?.length || 0)
  return data || []
}
