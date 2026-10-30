import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCatalogClient } from './client'
afterEach(() => vi.unstubAllGlobals())
describe('catalog adapters', () => {
  it('uses existing HTTP endpoints and passes request cancellation', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    vi.stubGlobal('fetch', fetch)
    const controller = new AbortController()
    await createCatalogClient('https://api.example/').index('uk-UA', controller.signal)
    expect(fetch).toHaveBeenCalledWith('https://api.example/api/letters?lang=uk', { signal: controller.signal })
  })
  it('rejects malformed responses so the retry state can recover', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => '<html>not JSON data</html>' }))
    await expect(createCatalogClient().index('en')).rejects.toThrow('Invalid catalog response')
  })
})
