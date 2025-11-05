export interface Job {
  id: string
  title: string
  description: string
  requirements: string | null
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface JobQuestion {
  id: string
  job_id: string
  question: string
  question_type: 'text' | 'textarea' | 'select' | 'checkbox'
  required: boolean
  order: number
  options?: string[] // For select/checkbox types
  created_at: string
}
