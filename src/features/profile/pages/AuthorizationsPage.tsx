import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { getAuthorizations, signAuthorization } from '../../../lib/api/authorizations'
import type { Authorization } from '../../../types'

const AUTHORIZATION_TYPES: Array<{
  type: Authorization['authorization_type']
  title: string
  description: string
  content: string
}> = [
  {
    type: 'applicant_certification',
    title: 'Applicant Certification',
    description: 'I certify that the information provided is true and complete.',
    content: `I certify that all information provided in this application is true and complete to the best of my knowledge. I understand that any false statements or omissions may result in rejection of my application or termination of employment if discovered later.`,
  },
  {
    type: 'fmcsa_clearinghouse',
    title: 'FMCSA Drug and Alcohol Clearinghouse Authorization',
    description: 'Authorization for FMCSA Drug and Alcohol Clearinghouse queries (49 CFR 382.701).',
    content: `I hereby authorize the release of information from the Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse to the prospective employer. This authorization is in accordance with 49 CFR 382.701.

I understand that:
- The employer will query the Clearinghouse for information about my drug and alcohol violations
- This authorization is required for employment consideration
- I may review my own Clearinghouse record at any time`,
  },
  {
    type: 'hireright_background',
    title: 'HireRight Background Check Authorization',
    description: 'Authorization for HireRight to conduct a background check.',
    content: `I hereby authorize HireRight and its agents to conduct a comprehensive background check, which may include:

- Criminal record searches
- Employment history verification
- Education verification
- Motor vehicle record checks
- Credit history (where permitted by law)
- Other relevant background information

I understand that this authorization is valid for the duration of the employment process and may be used for future employment decisions.`,
  },
  {
    type: 'psp_authorization',
    title: 'PSP Authorization',
    description: 'Authorization for Pre-Employment Screening Program (PSP) records.',
    content: `I hereby authorize the release of my Pre-Employment Screening Program (PSP) records to the prospective employer.

I understand that:
- PSP records contain my commercial driver's license (CDL) violation history
- This information will be used to evaluate my application for employment
- I may request a copy of my PSP record at any time
- This authorization is required for employment consideration`,
  },
]

export function AuthorizationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [authorizations, setAuthorizations] = useState<Authorization[]>([])
  const [signing, setSigning] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadAuthorizations()
    }
  }, [user])

  const loadAuthorizations = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getAuthorizations(user.id)
      setAuthorizations(data)
    } catch (error) {
      console.error('Error loading authorizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (authorizationType: Authorization['authorization_type']) => {
    if (!user) return

    setSigning(authorizationType)
    try {
      await signAuthorization(user.id, authorizationType)
      await loadAuthorizations()
    } catch (error) {
      console.error('Error signing authorization:', error)
      alert('Failed to sign authorization. Please try again.')
    } finally {
      setSigning(null)
    }
  }

  const isSigned = (type: Authorization['authorization_type']): boolean => {
    const auth = authorizations.find(a => a.authorization_type === type)
    return auth?.signed || false
  }

  const getSignedDate = (type: Authorization['authorization_type']): string | null => {
    const auth = authorizations.find(a => a.authorization_type === type)
    return auth?.signed_at ? new Date(auth.signed_at).toLocaleDateString() : null
  }

  const allSigned = AUTHORIZATION_TYPES.every(auth => isSigned(auth.type))

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Authorizations & Releases</h1>
        <p className="mt-2 text-gray-600">
          Please read and sign all required authorizations. All authorizations must be signed to
          complete your profile.
        </p>
      </div>

      <div className="space-y-6">
        {AUTHORIZATION_TYPES.map(authType => {
          const signed = isSigned(authType.type)
          const signedDate = getSignedDate(authType.type)

          return (
            <div key={authType.type} className="bg-white border rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{authType.title}</h2>
                <p className="text-gray-600 mb-4">{authType.description}</p>

                <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{authType.content}</p>
                </div>

                {signed ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Signed on {signedDate}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(authType.type)}
                    disabled={signing === authType.type}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {signing === authType.type ? 'Signing...' : 'I Agree and Sign'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900">Important Information</h3>
            <p className="text-sm text-blue-800 mt-1">
              All authorizations must be signed before you can submit job applications. Your
              electronic signature is legally binding and will be recorded with a timestamp.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate({ to: '/profile/documents' })}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            if (allSigned) {
              navigate({ to: '/dashboard' })
            } else {
              alert('Please sign all required authorizations before continuing.')
            }
          }}
          disabled={!allSigned}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Profile
        </button>
      </div>
    </div>
  )
}
