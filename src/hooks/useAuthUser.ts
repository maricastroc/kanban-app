import useRequest from '@/utils/useRequest'

interface AuthUser {
  id: number | string
  name: string
  email: string
}

// stable reference — keeps SWR's key constant across renders
const USER_REQUEST = { url: '/user', method: 'GET' }

/**
 * Resolves the current session from the httpOnly auth cookie by probing the
 * `/user` endpoint. The token itself is never exposed to JavaScript, so this
 * is the only way the client knows whether it's authenticated.
 */
export function useAuthUser() {
  const { data, error, mutate } = useRequest<AuthUser>(USER_REQUEST, {
    shouldRetryOnError: false,
  })

  return {
    user: data ?? null,
    isAuthenticated: !!data && !error,
    isLoading: data === undefined && error === undefined,
    mutate,
  }
}
