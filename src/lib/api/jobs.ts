import { supabase } from '../supabase'
import type { Job, JobQuestion } from '../../types'

export async function getJobs(includeInactive = false): Promise<Job[]> {
  let query = supabase.from('jobs').select('*').order('created_at', { ascending: false })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  return data || []
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }

  return data
}

export async function createJob(
  userId: string,
  job: Omit<Job, 'id' | 'created_by' | 'created_at' | 'updated_at'>
): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      ...job,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating job:', error)
    return null
  }

  return data
}

export async function updateJob(
  id: string,
  updates: Partial<Omit<Job, 'id' | 'created_by' | 'created_at' | 'updated_at'>>
): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating job:', error)
    return null
  }

  return data
}

export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabase.from('jobs').delete().eq('id', id)

  if (error) {
    console.error('Error deleting job:', error)
    return false
  }

  return true
}

export async function getJobQuestions(jobId: string): Promise<JobQuestion[]> {
  const { data, error } = await supabase
    .from('job_questions')
    .select('*')
    .eq('job_id', jobId)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching job questions:', error)
    return []
  }

  // Parse options from JSONB
  if (data) {
    return data.map(q => ({
      ...q,
      options:
        q.options && typeof q.options === 'string' ? JSON.parse(q.options) : q.options || null,
    }))
  }

  return []
}

export async function createJobQuestion(
  question: Omit<JobQuestion, 'id' | 'created_at'>
): Promise<JobQuestion | null> {
  const { data, error } = await supabase
    .from('job_questions')
    .insert({
      ...question,
      options: question.options ? JSON.stringify(question.options) : null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating job question:', error)
    return null
  }

  // Parse options from JSONB
  if (data && data.options) {
    data.options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options
  }

  return data
}

export async function updateJobQuestion(
  id: string,
  updates: Partial<Omit<JobQuestion, 'id' | 'job_id' | 'created_at'>>
): Promise<JobQuestion | null> {
  const updateData: Record<string, unknown> = { ...updates }
  if (updateData.options) {
    updateData.options = JSON.stringify(updateData.options)
  }

  const { data, error } = await supabase
    .from('job_questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating job question:', error)
    return null
  }

  // Parse options from JSONB
  if (data && data.options) {
    data.options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options
  }

  return data
}

export async function deleteJobQuestion(id: string): Promise<boolean> {
  const { error } = await supabase.from('job_questions').delete().eq('id', id)

  if (error) {
    console.error('Error deleting job question:', error)
    return false
  }

  return true
}
