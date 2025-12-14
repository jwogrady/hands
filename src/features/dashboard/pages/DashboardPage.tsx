import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getUserRoles } from '../../../lib/api/userRoles'
import { getProfile } from '../../../lib/api/profile'
import { getEmploymentHistory, getCDLEmploymentHistory } from '../../../lib/api/employmentHistory'
import { getBackgroundQuestions, BACKGROUND_QUESTIONS } from '../../../lib/api/backgroundQuestions'
import { getEmergencyContacts } from '../../../lib/api/emergencyContacts'
import { getDocuments } from '../../../lib/api/documents'
import { getAuthorizations } from '../../../lib/api/authorizations'
import type { UserRole, Profile } from '../../../types'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [profileStatus, setProfileStatus] = useState({
    personalInfo: false,
    employmentHistory: false,
    cdlDrivingExperience: false,
    backgroundQuestions: false,
    emergencyContacts: false,
    documents: false,
    authorizations: false,
  })

  const checkPersonalInfoComplete = (profile: Profile | null): boolean => {
    if (!profile) return false
    // Check all required fields for personal info, addresses, CDL, driving experience
    return !!(
      (
        profile.full_name &&
        profile.phone &&
        profile.ssn &&
        profile.date_of_birth &&
        profile.present_address_street &&
        profile.present_address_city &&
        profile.present_address_state &&
        profile.present_address_zip
      )
      // CDL fields are optional - user may not have a CDL yet
      // The step is complete once address fields are filled
    )
  }

  const checkEmploymentHistoryComplete = async (userId: string): Promise<boolean> => {
    try {
      const allEmployment = await getEmploymentHistory(userId)
      // Complete if there's at least one employment record
      return allEmployment.length > 0
    } catch (error) {
      console.error('Error checking employment history:', error)
      return false
    }
  }

  const checkCDLDrivingExperienceComplete = async (userId: string): Promise<boolean> => {
    try {
      const cdlEmployment = await getCDLEmploymentHistory(userId)
      // Complete if there's at least one CDL employment record
      return cdlEmployment.length > 0
    } catch (error) {
      console.error('Error checking CDL driving experience:', error)
      return false
    }
  }

  const checkBackgroundQuestionsComplete = async (userId: string): Promise<boolean> => {
    try {
      const questions = await getBackgroundQuestions(userId)
      return questions.length === BACKGROUND_QUESTIONS.length
    } catch (error) {
      console.error('Error checking background questions:', error)
      return false
    }
  }

  const checkEmergencyContactsComplete = async (userId: string): Promise<boolean> => {
    try {
      const contacts = await getEmergencyContacts(userId)
      return contacts.length >= 1
    } catch (error) {
      console.error('Error checking emergency contacts:', error)
      return false
    }
  }

  const checkDocumentsComplete = async (userId: string): Promise<boolean> => {
    try {
      const documents = await getDocuments(userId)
      return documents.length > 0
    } catch (error) {
      console.error('Error checking documents:', error)
      return false
    }
  }

  const checkAuthorizationsComplete = async (userId: string): Promise<boolean> => {
    try {
      const authorizations = await getAuthorizations(userId)
      const requiredTypes: Array<
        | 'applicant_certification'
        | 'fmcsa_clearinghouse'
        | 'hireright_background'
        | 'psp_authorization'
      > = [
        'applicant_certification',
        'fmcsa_clearinghouse',
        'hireright_background',
        'psp_authorization',
      ]
      const signedTypes = authorizations.filter(a => a.signed).map(a => a.authorization_type)
      return requiredTypes.every(type => signedTypes.includes(type))
    } catch (error) {
      console.error('Error checking authorizations:', error)
      return false
    }
  }

  const loadUserData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const roles = await getUserRoles(user.id)
      setUserRoles(roles)

      const profile = await getProfile(user.id)

      // Check each section's completion status
      const personalInfo = checkPersonalInfoComplete(profile)
      const employmentHistory = await checkEmploymentHistoryComplete(user.id)
      const cdlDrivingExperience = await checkCDLDrivingExperienceComplete(user.id)
      const backgroundQuestions = await checkBackgroundQuestionsComplete(user.id)
      const emergencyContacts = await checkEmergencyContactsComplete(user.id)
      const documents = await checkDocumentsComplete(user.id)
      const authorizations = await checkAuthorizationsComplete(user.id)

      setProfileStatus({
        personalInfo,
        employmentHistory,
        cdlDrivingExperience,
        backgroundQuestions,
        emergencyContacts,
        documents,
        authorizations,
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  const isManager = userRoles.some(role => role.role === 'manager')
  const isCandidate = userRoles.some(role => role.role === 'candidate')

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Candidate Dashboard */}
      {isCandidate && (
        <div className="space-y-6">
          {(() => {
            const allComplete =
              profileStatus.personalInfo &&
              profileStatus.employmentHistory &&
              profileStatus.cdlDrivingExperience &&
              profileStatus.backgroundQuestions &&
              profileStatus.emergencyContacts &&
              profileStatus.documents &&
              profileStatus.authorizations

            // Find the next incomplete section (the blocker)
            const getNextBlocker = (): string => {
              if (!profileStatus.personalInfo) return '/profile/create'
              if (!profileStatus.employmentHistory) return '/profile/employment-history'
              if (!profileStatus.cdlDrivingExperience) return '/profile/cdl-driving-experience'
              if (!profileStatus.backgroundQuestions) return '/profile/background-questions'
              if (!profileStatus.emergencyContacts) return '/profile/emergency-contacts'
              if (!profileStatus.documents) return '/profile/documents'
              if (!profileStatus.authorizations) return '/profile/authorizations'
              return '/profile/create' // Fallback
            }

            // Determine if profile has never been started (no personal info at all)
            const profileNeverStarted = !profileStatus.personalInfo

            return allComplete ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-green-900">Profile Complete</h3>
                    <p className="text-sm text-green-800 mt-1">You're ready to apply for jobs!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Let's Get Your Profile Ready</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Complete your profile to start applying for jobs. We'll walk you through each
                      section step by step. Once everything is filled out, you'll be ready to apply!
                    </p>
                    <button
                      onClick={() => navigate({ to: getNextBlocker() })}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      {profileNeverStarted ? 'Get Started →' : 'Complete Your Profile →'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/profile/create' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.personalInfo ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Personal Information</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Name, email, phone, SSN, date of birth, address, CDL info
                      </div>
                    </div>
                    {profileStatus.personalInfo ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/employment-history' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.employmentHistory ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Employment History</div>
                      <div className="text-sm text-gray-600 mt-1">Last 3 years of employment</div>
                    </div>
                    {profileStatus.employmentHistory ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/cdl-driving-experience' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.cdlDrivingExperience ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">CDL Driving Experience</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Last 7 years of CDL employment
                      </div>
                    </div>
                    {profileStatus.cdlDrivingExperience ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/background-questions' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.backgroundQuestions ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Background Questions</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Answer required background questions
                      </div>
                    </div>
                    {profileStatus.backgroundQuestions ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/emergency-contacts' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.emergencyContacts ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Emergency Contacts</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Add up to 3 emergency contacts
                      </div>
                    </div>
                    {profileStatus.emergencyContacts ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/documents' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.documents ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Documents</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Upload resume, CDL license, certifications
                      </div>
                    </div>
                    {profileStatus.documents ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/profile/authorizations' })}
                  className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors relative"
                  style={{
                    borderColor: profileStatus.authorizations ? '#10b981' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Authorizations</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Sign required authorizations and releases
                      </div>
                    </div>
                    {profileStatus.authorizations ? (
                      <svg
                        className="w-5 h-5 text-green-600 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </button>
              </div>
            </div>

            {/* Job Applications */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/jobs/browse' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Browse Jobs</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View available job postings and apply
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/applications' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">My Applications</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Track the status of your applications
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Dashboard */}
      {isManager && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Posting Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Posting Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/jobs' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Manage Job Postings</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View, create, edit, and manage job postings
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/jobs/create' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Create New Job Posting</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Post a new job with custom questions
                  </div>
                </button>
              </div>
            </div>

            {/* Candidate & Application Management */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Review & Management</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate({ to: '/manager/candidates' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Candidates Dashboard</div>
                  <div className="text-sm text-gray-600 mt-1">
                    View and filter candidate profiles
                  </div>
                </button>
                <button
                  onClick={() => navigate({ to: '/manager/applications' })}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Applications Dashboard</div>
                  <div className="text-sm text-gray-600 mt-1">Review and manage applications</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No role assigned */}
      {!isManager && !isCandidate && (
        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-gray-600">No role assigned. Please contact an administrator.</p>
        </div>
      )}
    </div>
  )
}
