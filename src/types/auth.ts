import type { User } from '@supabase/supabase-js'

export type AuthUser = User

export interface AuthSession {
  user: AuthUser | null
  loading: boolean
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}
