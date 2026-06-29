import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // react() enables JSX for hook/component tests.
  plugins: [react()],
  // Resolve the "@/*" alias from tsconfig.json natively, so tests import modules
  // the same way the app does.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/hooks/**'],
    },
  },
})
