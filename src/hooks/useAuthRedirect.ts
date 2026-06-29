import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthUser } from './useAuthUser'

/**
 * Guards protected pages: redirects to /login once the session probe resolves
 * as unauthenticated. `isCheckingAuth` stays true while the probe is in flight.
 */
export function useAuthRedirect() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthUser()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  return { isCheckingAuth: isLoading }
}
