import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getProfile } from '../../../lib/api/profile'
import { getEmploymentHistory } from '../../../lib/api/employmentHistory'
import { getBackgroundQuestions, BACKGROUND_QUESTIONS } from '../../../lib/api/backgroundQuestions'
import { getEmergencyContacts } from '../../../lib/api/emergencyContacts'
import { getDocuments } from '../../../lib/api/documents'
import { getAuthorizations } from '../../../lib/api/authorizations'
import { getApplications } from '../../../lib/api/applications'
import { getJob } from '../../../lib/api/jobs'
import type {
  Profile,
  EmploymentHistory,
  BackgroundQuestion,
  EmergencyContact,
  Document,
  Authorization,
  Application,
  Job,
} from '../../../types'

export function CandidateDetailPage() {
  const navigate = useNavigate()
  const location = window.location.pathname
  // Extract candidateId from path like /manager/candidates/$candidateId
  const pathParts = location.split('/').filter(Boolean)
  const candidateId = pathParts[2] // Third segment after 'manager' and 'candidates'

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([])
  const [backgroundQuestions, setBackgroundQuestions] = useState<BackgroundQuestion[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [authorizations, setAuthorizations] = useState<Authorization[]>([])
  const [applications, setApplications] = useState<(Application & { job?: Job })[]>([])

  useEffect(() => {
    if (candidateId) {
      loadCandidateData()
    }
  }, [candidateId])

  const loadCandidateData = async () => {
    if (!candidateId) return
    setLoading(true)
    try {
      const [
        profileData,
        employmentData,
        questionsData,
        contactsData,
        docsData,
        authsData,
        appsData,
      ] = await Promise.all([
        getProfile(candidateId),
        getEmploymentHistory(candidateId),
        getBackgroundQuestions(candidateId),
        getEmergencyContacts(candidateId),
        getDocuments(candidateId),
        getAuthorizations(candidateId),
        getApplications(candidateId),
      ])

      setProfile(profileData)
      setEmploymentHistory(employmentData || [])
      setBackgroundQuestions(questionsData || [])
      setEmergencyContacts(contactsData || [])
      setDocuments(docsData || [])
      setAuthorizations(authsData || [])

      // Load job details for applications
      const appsWithJobs = await Promise.all(
        appsData.map(async app => {
          const job = await getJob(app.job_id)
          return { ...app, job }
        })
      )
      setApplications(appsWithJobs)
    } catch (error) {
      console.error('Error loading candidate data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Candidate not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate({ to: '/manager/candidates' })}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Candidates
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Candidate Profile</h1>

        {/* Personal Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{profile.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{profile.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">SSN</label>
              <p className="text-gray-900">{profile.ssn || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-gray-900">
                {profile.date_of_birth
                  ? new Date(profile.date_of_birth).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Present Address</label>
              <p className="text-gray-900">
                {profile.present_address_street && profile.present_address_city
                  ? `${profile.present_address_street}, ${profile.present_address_city}, ${profile.present_address_state} ${profile.present_address_zip}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* CDL Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">CDL Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">CDL Number</label>
              <p className="text-gray-900">{profile.cdl_number || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CDL State</label>
              <p className="text-gray-900">{profile.cdl_state || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CDL Expiration</label>
              <p className="text-gray-900">
                {profile.cdl_expiration_date
                  ? new Date(profile.cdl_expiration_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Driving Experience */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Driving Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Years of Experience</label>
              <p className="text-gray-900">{profile.driving_experience_years || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Miles</label>
              <p className="text-gray-900">
                {profile.driving_experience_miles
                  ? profile.driving_experience_miles.toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Equipment Types</label>
              <p className="text-gray-900">
                {profile.driving_experience_equipment?.join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Employment History */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Employment History</h2>
          {employmentHistory.length === 0 ? (
            <p className="text-gray-500">No employment history recorded.</p>
          ) : (
            <div className="space-y-4">
              {employmentHistory.map(employment => (
                <div key={employment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{employment.company_name}</h3>
                    {employment.is_cdl_employment && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        CDL Employment
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {employment.company_address_city && employment.company_address_state && (
                      <>
                        {employment.company_address_city}, {employment.company_address_state}
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(employment.start_date).toLocaleDateString()} -{' '}
                    {employment.end_date
                      ? new Date(employment.end_date).toLocaleDateString()
                      : 'Present'}
                  </p>
                  {employment.supervisor_name && (
                    <p className="text-sm text-gray-600">
                      Supervisor: {employment.supervisor_name}
                      {employment.supervisor_phone && ` - ${employment.supervisor_phone}`}
                    </p>
                  )}
                  {employment.reason_for_leaving && (
                    <p className="text-sm text-gray-600 mt-2">
                      Reason: {employment.reason_for_leaving}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Background Questions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Background Questions</h2>
          {backgroundQuestions.length === 0 ? (
            <p className="text-gray-500">No background questions answered.</p>
          ) : (
            <div className="space-y-3">
              {backgroundQuestions.map(q => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {q.question_number}. {BACKGROUND_QUESTIONS[q.question_number - 1]}
                      </p>
                      <p className="mt-1">
                        Answer:{' '}
                        <span className={q.answer ? 'text-red-600' : 'text-green-600'}>
                          {q.answer ? 'Yes' : 'No'}
                        </span>
                      </p>
                      {q.answer && q.explanation && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Emergency Contacts */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          {emergencyContacts.length === 0 ? (
            <p className="text-gray-500">No emergency contacts recorded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{contact.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    {contact.address_city}, {contact.address_state} {contact.address_zip}
                  </p>
                  <p className="text-sm text-gray-600">Relationship: {contact.relationship}</p>
                  <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded.</p>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{doc.file_name}</p>
                    <p className="text-sm text-gray-600">
                      {doc.document_type.replace('_', ' ')} •{' '}
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      const { getDocumentUrl } = await import('../../../lib/api/documents')
                      const url = await getDocumentUrl(doc)
                      if (url) window.open(url, '_blank')
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Authorizations */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Authorizations</h2>
          {authorizations.length === 0 ? (
            <p className="text-gray-500">No authorizations signed.</p>
          ) : (
            <div className="space-y-2">
              {authorizations.map(auth => (
                <div
                  key={auth.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">
                      {auth.authorization_type
                        .replace('_', ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-600">
                      {auth.signed
                        ? `Signed on ${new Date(auth.signed_at!).toLocaleDateString()}`
                        : 'Not signed'}
                    </p>
                  </div>
                  {auth.signed && <span className="text-green-600 text-sm">✓ Signed</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Applications */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500">No applications submitted.</p>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{app.job?.title || 'Job Title N/A'}</h3>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : app.status === 'under_review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate({ to: `/manager/applications/${app.id}` })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Application →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
