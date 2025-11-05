export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: 'candidate' | 'manager'
  created_at: string
}
