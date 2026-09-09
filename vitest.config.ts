import { guardTestEnvironment } from './__tests__/local-target'
guardTestEnvironment()
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    fileParallelism: false,
    testTimeout: 120000,
    hookTimeout: 120000,

    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      'server-only': resolve(__dirname, '__tests__/server-only.ts'),
      '@': resolve(__dirname, '.'),
    },
  },
})
