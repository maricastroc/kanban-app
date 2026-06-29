// Pin the timezone so date-based utils (formatDate, getDueStatus) produce the
// same results locally and in CI, regardless of the machine's timezone.
process.env.TZ = 'UTC'

import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees rendered by Testing Library between tests so state and
// the DOM don't leak across cases.
afterEach(() => {
  cleanup()
})
