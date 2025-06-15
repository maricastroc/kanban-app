/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function useAuthRedirect() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.replace('/login')
    } else {
      setIsCheckingAuth(false)
    }
  }, [])

  return { isCheckingAuth }
}
