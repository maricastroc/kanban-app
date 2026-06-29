import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import toast from 'react-hot-toast'
import { handleApiError } from './handleApiError'

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}))

const mockedToast = vi.mocked(toast)

const GENERIC_MESSAGE = 'Ooops, something went wrong. Please try again later.'

// handleApiError uses axios.isAxiosError(), which at runtime only checks the
// `isAxiosError` flag — so a plain object with that flag stands in for a real
// AxiosError without needing the constructor.
const axiosError = (data: unknown) => ({ isAxiosError: true, response: { data } })

describe('handleApiError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Silence the function's diagnostic console.log during tests.
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the API message when it is a string', () => {
    handleApiError(axiosError({ message: 'Email already taken' }))
    expect(mockedToast.error).toHaveBeenCalledWith('Email already taken')
  })

  it('joins field errors when the message is an object', () => {
    handleApiError(
      axiosError({
        message: { name: 'Name is required', email: 'Email is invalid' },
      }),
    )
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Name is required, Email is invalid',
    )
  })

  it('shows a generic fallback for a non-Axios error', () => {
    handleApiError(new Error('boom'))
    expect(mockedToast.error).toHaveBeenCalledWith(GENERIC_MESSAGE)
  })
})
