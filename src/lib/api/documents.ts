import { supabase } from '../supabase'
import type { Document } from '../../types'

const STORAGE_BUCKET = 'documents'

export async function getDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return []
  }

  return data || []
}

export async function uploadDocument(
  userId: string,
  file: File,
  documentType: Document['document_type']
): Promise<Document | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    return null
  }

  // Create document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating document record:', error)
    // Try to delete uploaded file if record creation fails
    await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
    return null
  }

  return data
}

export async function deleteDocument(id: string): Promise<boolean> {
  // Get document to find file path
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .single()

  if (fetchError || !document) {
    console.error('Error fetching document:', fetchError)
    return false
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([document.file_path])

  if (storageError) {
    console.error('Error deleting file from storage:', storageError)
  }

  // Delete record
  const { error } = await supabase.from('documents').delete().eq('id', id)

  if (error) {
    console.error('Error deleting document record:', error)
    return false
  }

  return true
}

export async function getDocumentUrl(document: Document): Promise<string | null> {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(document.file_path)
  return data.publicUrl
}
