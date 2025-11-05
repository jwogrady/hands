export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'more_info_requested'

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  status: ApplicationStatus
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationAnswer {
  id: string
  application_id: string
  question_id: string
  answer: string
  created_at: string
}
