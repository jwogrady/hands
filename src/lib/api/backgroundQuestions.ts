import { supabase } from '../supabase'
import type { BackgroundQuestion } from '../../types'

export const BACKGROUND_QUESTIONS = [
  'Have you ever been convicted of a felony or misdemeanor?',
  'Have you ever been denied a license, permit, or privilege to operate a motor vehicle?',
  'Has any license, permit, or privilege to operate a motor vehicle ever been suspended or revoked?',
  'Have you been convicted of DWI/DUI in the last 10 years?',
  'Have you tested positive for alcohol or drugs in the last 3 years?',
  'Have you refused to take an alcohol or drug test in the last 3 years?',
  'Have you been denied a job due to a failed alcohol or drug test in the last 3 years?',
  'Have you ever been discharged or asked to resign from a job?',
  'Are you able to perform the essential functions of the job for which you are applying?',
] as const

export async function getBackgroundQuestions(userId: string): Promise<BackgroundQuestion[]> {
  const { data, error } = await supabase
    .from('background_questions')
    .select('*')
    .eq('user_id', userId)
    .order('question_number', { ascending: true })

  if (error) {
    console.error('Error fetching background questions:', error)
    return []
  }

  return data || []
}

export async function upsertBackgroundQuestion(
  userId: string,
  questionNumber: number,
  answer: boolean,
  explanation: string | null = null
): Promise<BackgroundQuestion | null> {
  const { data, error } = await supabase
    .from('background_questions')
    .upsert(
      {
        user_id: userId,
        question_number: questionNumber,
        answer,
        explanation,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,question_number',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting background question:', error)
    return null
  }

  return data
}
