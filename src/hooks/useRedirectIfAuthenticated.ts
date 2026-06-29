/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * Guards the auth pages (login/register): if a session token already exists,
 * redirect to the app; otherwise reveal the page. Complement of useAuthRedirect.
 */
export function useRedirectIfAuthenticated() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.replace('/')
    } else {
      setIsCheckingAuth(false)
    }
  }, [])

  return { isCheckingAuth }
}
