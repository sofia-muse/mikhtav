import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchIndex, fetchLetter, fetchGlossary } from './api'

afterEach(() => vi.unstubAllGlobals())
describe('static catalog transport', () => {
  it('loads locale snapshots and supports regional and unknown locales', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    vi.stubGlobal('fetch', fetch)
    await fetchIndex('ru-RU')
    expect(fetch).toHaveBeenLastCalledWith('/catalog/ru/index.json')
    await fetchLetter('ishur-bituach', 'he')
    expect(fetch).toHaveBeenLastCalledWith('/catalog/he/ishur-bituach.json')
    await fetchGlossary('unknown')
    expect(fetch).toHaveBeenLastCalledWith('/catalog/en/glossary.json')
  })
  it('rejects a missing snapshot instead of returning invalid data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(fetchLetter('missing', 'en')).rejects.toThrow('API 404')
  })
})
