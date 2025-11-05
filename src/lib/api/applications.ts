import { supabase } from '../supabase'
import type { Application, ApplicationAnswer } from '../../types'

export async function getApplications(userId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('candidate_id', userId)
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

export async function getApplication(id: string): Promise<Application | null> {
  const { data, error } = await supabase.from('applications').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching application:', error)
    return null
  }

  return data
}

export async function createApplication(
  userId: string,
  jobId: string
): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      candidate_id: userId,
      status: 'submitted',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating application:', error)
    return null
  }

  return data
}

export async function getApplicationAnswers(applicationId: string): Promise<ApplicationAnswer[]> {
  const { data, error } = await supabase
    .from('application_answers')
    .select('*')
    .eq('application_id', applicationId)

  if (error) {
    console.error('Error fetching application answers:', error)
    return []
  }

  return data || []
}

export async function upsertApplicationAnswer(
  applicationId: string,
  questionId: string,
  answer: string
): Promise<ApplicationAnswer | null> {
  const { data, error } = await supabase
    .from('application_answers')
    .upsert(
      {
        application_id: applicationId,
        question_id: questionId,
        answer,
      },
      {
        onConflict: 'application_id,question_id',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error saving application answer:', error)
    return null
  }

  return data
}
