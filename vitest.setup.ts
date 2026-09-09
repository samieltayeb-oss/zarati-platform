import { guardTestEnvironment } from './__tests__/local-target'
guardTestEnvironment()
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
