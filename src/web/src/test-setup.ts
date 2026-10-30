import '@testing-library/jest-dom/vitest'
import './i18n'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { queryClient } from './shared/data/queries'

queryClient.setDefaultOptions({ queries: { retry: false, gcTime: 0 } })
beforeEach(() => queryClient.clear())

afterEach(() => {
  cleanup()
  queryClient.clear()
})
