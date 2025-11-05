export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string
  phone: string | null
  ssn: string | null
  date_of_birth: string | null
  present_address_street: string | null
  present_address_city: string | null
  present_address_state: string | null
  present_address_zip: string | null
  cdl_number: string | null
  cdl_state: string | null
  cdl_expiration_date: string | null
  driving_experience_years: number | null
  driving_experience_miles: number | null
  driving_experience_equipment: string[] | null
  profile_completed_at: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: 'candidate' | 'manager'
  created_at: string
}

export * from './profile'
