export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface AddressHistory extends Address {
  id: string
  user_id: string
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface EmploymentHistory {
  id: string
  user_id: string
  company_name: string
  company_address_street: string | null
  company_address_city: string | null
  company_address_state: string | null
  company_address_zip: string | null
  supervisor_name: string | null
  supervisor_phone: string | null
  supervisor_email: string | null
  start_date: string
  end_date: string | null
  reason_for_leaving: string | null
  cdl_required: boolean
  is_cdl_employment: boolean
  created_at: string
  updated_at: string
}

export interface BackgroundQuestion {
  id: string
  user_id: string
  question_number: number
  answer: boolean
  explanation: string | null
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  full_name: string
  address_street: string | null
  address_city: string
  address_state: string
  address_zip: string
  relationship: string
  phone: string
  order: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  document_type: 'resume' | 'cdl_license' | 'certification' | 'other'
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
  created_at: string
}

export interface Authorization {
  id: string
  user_id: string
  authorization_type:
    | 'applicant_certification'
    | 'fmcsa_clearinghouse'
    | 'hireright_background'
    | 'psp_authorization'
  signed: boolean
  signed_at: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface CandidateProfile {
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

export interface ProfileFormData {
  // Personal Information
  full_name: string
  email: string
  phone: string
  ssn: string
  date_of_birth: string

  // Present Address
  present_address_street: string
  present_address_city: string
  present_address_state: string
  present_address_zip: string

  // CDL Information
  cdl_number: string
  cdl_state: string
  cdl_expiration_date: string

  // Driving Experience
  driving_experience_years: number
  driving_experience_miles: number
  driving_experience_equipment: string[]
}
