import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoles } from '@/lib/api/userRoles'

interface ManagerRouteProps {
  children: ReactNode
}

export function ManagerRoute({ children }: ManagerRouteProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isManager, setIsManager] = useState(false)

  useEffect(() => {
    const checkManagerRole = async () => {
      if (authLoading || !isAuthenticated || !user) {
        if (!authLoading && !isAuthenticated) {
          navigate({ to: '/login' })
        }
        setLoading(false)
        return
      }

      try {
        const roles = await getUserRoles(user.id)
        const hasManagerRole = roles.some(role => role.role === 'manager')
        setIsManager(hasManagerRole)

        if (!hasManagerRole) {
          // Redirect to dashboard if not a manager
          navigate({ to: '/dashboard' })
        }
      } catch (error) {
        console.error('Error checking manager role:', error)
        navigate({ to: '/dashboard' })
      } finally {
        setLoading(false)
      }
    }

    checkManagerRole()
  }, [user, isAuthenticated, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isManager) {
    return null
  }

  return <>{children}</>
}
