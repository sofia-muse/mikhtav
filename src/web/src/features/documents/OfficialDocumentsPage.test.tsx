import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { OfficialDocumentsPage } from './pages/OfficialDocumentsPage'
import type { OfficialDocument } from '../../shared/types'
import i18n from '../../shared/i18n'
import { beforeEach } from 'vitest'

beforeEach(async () => { await i18n.changeLanguage('en') })
const translation = { title: 'Income form', summary: 'A public form for income reporting.' }
const document: OfficialDocument = { id: 'income', kind: 'form', issuer: 'bituach-leumi', officialTitleHe: 'דיווח הכנסות', formNumber: '101', sourcePageUrl: 'https://www.gov.il/example', downloadUrl: 'https://www.gov.il/original.pdf', relatedLetterSlugs: ['income-guide'], translations: { en: translation, ru: translation, uk: translation, he: translation }, retrieval: { status: 'verified', checkedAt: '2026-10-29T09:00:00Z', httpStatus: 200, contentType: 'application/pdf', sha256: 'abc123', bytes: 100, localPath: '/official/files/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.pdf' } }
function setup(documents: OfficialDocument[], path = '/documents') {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ schemaVersion: 1, generatedAt: '2026-10-29', documents }) }))
  render(<MemoryRouter initialEntries={[path]}><OfficialDocumentsPage /></MemoryRouter>)
}
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
describe('official document catalog', () => {
  it('shows letter context and preserves it when clearing document filters', async () => {
    const guide = { slug: 'income-guide', name: 'Debt notice', issuer: 'National Insurance Institute', sections: [], guidance: {} }
    const other = { ...document, id: 'unrelated', relatedLetterSlugs: ['other'] }
    vi.stubGlobal('fetch', vi.fn(async (url) => ({ ok: true, json: async () => String(url).includes('/official/') ? { schemaVersion: 1, documents: [document, other] } : guide })))
    render(<MemoryRouter initialEntries={['/documents?letter=income-guide&q=missing&lang=en']}><OfficialDocumentsPage /></MemoryRouter>)
    expect(await screen.findByText('Debt notice')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Documents for this letter' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to explanation/ })).toHaveAttribute('href', '/letters/income-guide?lang=en')
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findAllByRole('heading', { name: 'Income form' })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Documents for this letter' })).toBeInTheDocument()
    const filters = screen.getByRole('button', { name: 'Filters' })
    expect(filters).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(filters)
    expect(filters).toHaveAttribute('aria-expanded', 'true')
  })
  it('uses only a preview tied to the original PDF hash and exposes dimensions', async () => {
    const digest = 'a'.repeat(64)
    setup([{ ...document, retrieval: { ...document.retrieval, sha256: digest }, preview: { url: `/official/previews/${digest}.webp`, width: 480, height: 679, sourceSha256: digest } }])
    await screen.findByRole('heading', { name: 'Income form' })
    const image = screen.getByRole('article').querySelector('img')!
    expect(image).toHaveAttribute('src', `/official/previews/${digest}.webp`)
    expect(image).toHaveAttribute('width', '480')
    expect(image).toHaveAttribute('height', '679')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('link', { name: /Open PDF/ })).toHaveAttribute('target', '_blank')
  })
  it('renders real source and saved original provenance without implying editorial verification', async () => {
    setup([document])
    expect(await screen.findByRole('heading', { name: 'Income form' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Official source/ })).toHaveAttribute('href', document.sourcePageUrl)
    expect(screen.getByRole('link', { name: /Open PDF/ })).toHaveAttribute('href', '/official/files/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.pdf')
    expect(screen.getByText(/does not mean the content has been editorially reviewed/)).toBeInTheDocument()
    expect(screen.getByText('דיווח הכנסות')).toHaveAttribute('lang', 'he')
    expect(within(screen.getByRole('article')).getByText(/National Insurance Institute/)).toBeInTheDocument()
  })
  it('never offers a cached original for an unavailable entry, even with stale cache metadata', async () => {
    setup([{ ...document, retrieval: { ...document.retrieval, status: 'unavailable' } }])
    expect(await screen.findByText('Original not retrieved')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Open PDF/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Official source/ })).toBeInTheDocument()
  })
  it('searches Hebrew and form numbers, filters kinds and clears empty results', async () => {
    setup([document])
    const user = userEvent.setup()
    const search = await screen.findByRole('searchbox', { name: 'Search documents' })
    await user.type(search, 'דיווח')
    expect(screen.getByRole('status')).toHaveTextContent('Documents found: 1')
    await user.clear(search)
    await user.type(search, '101')
    expect(screen.getByRole('status')).toHaveTextContent('Documents found: 1')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Document type' }), 'guide')
    expect(screen.getByText('No documents match these filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByRole('status')).toHaveTextContent('Documents found: 1')
  })
  it('supports related-letter links and distinguishes templates from personal letters', async () => {
    setup([document, { ...document, id: 'notice', kind: 'notice-template', relatedLetterSlugs: ['other'], translations: { ...document.translations, en: { title: 'Example notice', summary: 'A public example.' } } }], '/documents?letter=other')
    const heading = await screen.findByRole('heading', { name: 'Example notice' })
    expect(within(heading.closest('article')!).getByText('A public example, not a notice addressed to you.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Income form' })).not.toBeInTheDocument()
  })
  it('recovers from failed loading with retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ ok: true, json: async () => ({ schemaVersion: 1, generatedAt: '', documents: [] }) }))
    const user = userEvent.setup()
    render(<MemoryRouter><OfficialDocumentsPage /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('No documents match these filters.')).toBeInTheDocument()
  })
  it('suppresses external lookalike, credential and nonstandard port links and invalid cache paths', async () => {
    setup([
      { ...document, sourcePageUrl: 'https://www.gov.il.evil.example/form', downloadUrl: 'https://user:secret@www.gov.il/form.pdf', retrieval: { ...document.retrieval, localPath: '/official/files/not-a-hash.pdf' } },
      { ...document, id: 'port', sourcePageUrl: 'https://www.btl.gov.il:8443/form', downloadUrl: null, retrieval: { ...document.retrieval, localPath: '/official/files/../outside.pdf' } },
    ])
    expect(await screen.findAllByRole('heading', { name: 'Income form' })).toHaveLength(2)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
  it('accepts exact official hosts and standard HTTPS port', async () => {
    setup([{ ...document, sourcePageUrl: 'https://btl.gov.il:443/form', downloadUrl: 'https://gov.il/form.pdf' }])
    expect(await screen.findByRole('link', { name: /Official source/ })).toHaveAttribute('href', 'https://btl.gov.il:443/form')
    expect(screen.getByRole('link', { name: /Open PDF/ })).toHaveAttribute('href', document.retrieval.localPath)
  })
})
