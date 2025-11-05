import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentUrl,
} from '../../../lib/api/documents'
import type { Document } from '../../../types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export function DocumentsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user])

  const loadDocuments = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getDocuments(user.id)
      setDocuments(data)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload PDF or image files.'
    }
    return null
  }

  const handleFileSelect = async (file: File, documentType: Document['document_type']) => {
    if (!user) return

    const error = validateFile(file)
    if (error) {
      alert(error)
      return
    }

    setUploading(true)
    try {
      await uploadDocument(user.id, file, documentType)
      await loadDocuments()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await deleteDocument(id)
      await loadDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, documentType: Document['document_type']) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], documentType)
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const renderUploadArea = (documentType: Document['document_type'], label: string) => {
    const existingDoc = documents.find(doc => doc.document_type === documentType)

    return (
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{label}</h3>

        {existingDoc ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{existingDoc.file_name}</p>
              <p className="text-sm text-gray-600">
                {formatFileSize(existingDoc.file_size)} • Uploaded{' '}
                {new Date(existingDoc.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  const url = await getDocumentUrl(existingDoc)
                  if (url) window.open(url, '_blank')
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(existingDoc.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={e => handleDrop(e, documentType)}
          >
            <input
              type="file"
              id={`file-${documentType}`}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0], documentType)
                }
              }}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor={`file-${documentType}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600">
                {uploading ? 'Uploading...' : 'Drag and drop or click to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                PDF, JPG, PNG up to {MAX_FILE_SIZE / 1024 / 1024}MB
              </p>
            </label>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="mt-2 text-gray-600">
          Please upload your required documents. All documents are securely stored.
        </p>
      </div>

      <div className="space-y-6">
        {renderUploadArea('resume', 'Resume/CV')}
        {renderUploadArea('cdl_license', 'CDL License')}
        {renderUploadArea('certification', 'Certifications (Optional)')}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate({ to: '/profile/emergency-contacts' })}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate({ to: '/profile/authorizations' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue to Authorizations →
        </button>
      </div>
    </div>
  )
}
