import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { OfficialDocumentsPage, type OfficialDocument } from './OfficialDocumentsPage'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }))
const translation = { title: 'Income form', summary: 'A public form for income reporting.' }
const document: OfficialDocument = { id: 'income', kind: 'form', issuer: 'bituach-leumi', officialTitleHe: 'דיווח הכנסות', formNumber: '101', sourcePageUrl: 'https://www.gov.il/example', downloadUrl: 'https://www.gov.il/original.pdf', relatedLetterSlugs: ['income-guide'], translations: { en: translation, ru: translation, uk: translation, he: translation }, retrieval: { status: 'verified', checkedAt: '2026-10-29T09:00:00Z', httpStatus: 200, contentType: 'application/pdf', sha256: 'abc123', bytes: 100, localPath: '/official/files/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.pdf' } }
function setup(documents: OfficialDocument[], path = '/documents') {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ schemaVersion: 1, generatedAt: '2026-10-29', documents }) }))
  render(<MemoryRouter initialEntries={[path]}><OfficialDocumentsPage /></MemoryRouter>)
}
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
describe('official document catalog', () => {
  it('renders real source and saved original provenance without implying editorial verification', async () => {
    setup([document])
    expect(await screen.findByRole('heading', { name: 'Income form' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Official source' })).toHaveAttribute('href', document.sourcePageUrl)
    expect(screen.getByRole('link', { name: 'Saved original PDF' })).toHaveAttribute('href', '/official/files/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.pdf')
    expect(screen.getByText(/does not mean the content has been editorially reviewed/)).toBeInTheDocument()
    expect(screen.getByText('דיווח הכנסות')).toHaveAttribute('lang', 'he')
    expect(screen.getByText(/National Insurance Institute/)).toBeInTheDocument()
  })
  it('never offers a cached original for an unavailable entry, even with stale cache metadata', async () => {
    setup([{ ...document, retrieval: { ...document.retrieval, status: 'unavailable' } }])
    expect(await screen.findByText('Original not retrieved')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Saved original PDF' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Official source' })).toBeInTheDocument()
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
    expect(await screen.findByRole('link', { name: 'Official source' })).toHaveAttribute('href', 'https://btl.gov.il:443/form')
    expect(screen.getByRole('link', { name: 'Original PDF on official website' })).toHaveAttribute('href', 'https://gov.il/form.pdf')
  })
})
