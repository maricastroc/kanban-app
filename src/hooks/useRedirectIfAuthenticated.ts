import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthUser } from './useAuthUser'

/**
 * Guards the auth pages (login/register): redirects to the app when the user
 * already has a valid session. Complement of useAuthRedirect.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthUser()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isLoading, isAuthenticated, router])

  return { isCheckingAuth: isLoading }
}
