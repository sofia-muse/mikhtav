import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { queryClient } from '../../../shared/data/queries'
import i18n from '../../../shared/i18n'
import type { LetterDetail } from '../../../shared/types'
import { LetterDetailPage } from './LetterDetailPage'

const detail: LetterDetail = {
  id: 3, slug: 'debt', name: 'Debt notice', nameHe: 'הודעת חוב', issuer: 'National Insurance', categoryName: 'Insurance', summary: 'What this notice means.',
  guidance: { overallSeverity: 'critical', primaryNextStep: 'Check the charge and respond.', deadlineSummary: null, needsDocuments: true, appliesWhen: 'A balance is outstanding.', recommendedChannel: 'Contact the branch.', whenToContactAuthority: 'If the charge is wrong.', whatToVerify: 'Check dates and amounts.' },
  sections: [{ order: 1, labelHe: 'סכום לתשלום', explainer: 'Amount due on your notice.', actionRequired: 'Prepare evidence.', deadline: null, severity: 'critical' }],
  editorial: { version: '1.1', sourceCheckedOn: '2026-10-28', sources: [{ title: 'Official information', url: 'https://www.btl.gov.il/Insurance/payments/Pages/default.aspx', scope: 'General contribution-debt guidance.' }] }, translationComplete: true,
}
const emptyDocuments = { schemaVersion: 1, generatedAt: '2026-10-28', documents: [] }
function mount(slug = 'debt') { return render(<MemoryRouter initialEntries={[`/letters/${slug}?lang=en`]}><Routes><Route path="/letters/:slug" element={<LetterDetailPage />} /></Routes></MemoryRouter>) }
beforeEach(async () => {
  queryClient.clear(); queryClient.setDefaultOptions({ queries: { retry: false } }); localStorage.clear()
  await i18n.changeLanguage('en')
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => ({ ok: true, json: async () => url.includes('/official/') ? emptyDocuments : detail })))
})
afterEach(() => { cleanup(); queryClient.clear(); vi.unstubAllGlobals() })

describe('letter detail', () => {
  it('puts the first action and checklist before expandable sections and makes source checks visible', async () => {
    const user = userEvent.setup()
    mount()
    expect(await screen.findByRole('heading', { level: 1, name: 'Debt notice' })).toBeInTheDocument()
    expect(screen.getByText('Check the charge and respond.')).toBeInTheDocument()
    expect(screen.getByText('Likely yes — gather supporting documents before you respond.')).toBeInTheDocument()
    const checklist = screen.getByRole('region', { name: 'Your action checklist' })
    const sections = screen.getByRole('region', { name: 'Section by section' })
    expect(checklist.compareDocumentPosition(sections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(document.querySelector('details')).not.toHaveAttribute('open')
    await user.click(screen.getByText('סכום לתשלום'))
    expect(document.querySelector('details')).toHaveAttribute('open')
    expect(screen.getByRole('link', { name: 'View official sources' })).toHaveAttribute('href', '#official-sources')
    expect(screen.getAllByText(/October 28, 2026/).length).toBeGreaterThan(0)
  })

  it('keeps completed tasks after translated data loads', async () => {
    const user = userEvent.setup()
    mount()
    await user.click(await screen.findByRole('checkbox', { name: 'Prepare evidence.' }))
    await act(() => i18n.changeLanguage('ru'))
    expect(await screen.findByRole('checkbox', { name: 'Prepare evidence.' })).toBeChecked()
    expect(screen.getByRole('heading', { name: 'Ваш список действий' })).toBeInTheDocument()
  })

  it('gives an unknown letter a useful catalog link', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response)
    mount('unknown')
    expect(await screen.findByRole('heading', { level: 1, name: 'This letter guide was not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /All letters/ })).toHaveAttribute('href', '/?lang=en')
  })

  it('keeps the guide and related documents visible if a background refresh fails', async () => {
    const translation = { title: 'Related official form', summary: 'A public blank form.' }
    const documents = { ...emptyDocuments, documents: [{ id: 'form-1', kind: 'form', issuer: 'bituach-leumi', officialTitleHe: 'טופס', formNumber: '1', sourcePageUrl: 'https://www.btl.gov.il/example', downloadUrl: null, relatedLetterSlugs: ['debt'], translations: { en: translation, he: translation, ru: translation, uk: translation }, retrieval: { status: 'unavailable', checkedAt: '2026-10-28', httpStatus: 403, contentType: null, sha256: null, bytes: null, localPath: null } }] }
    vi.mocked(fetch).mockImplementation(async (url) => ({ ok: true, json: async () => String(url).includes('/official/') ? documents : detail } as Response))
    mount()
    expect(await screen.findByRole('link', { name: 'Related official form' })).toBeInTheDocument()
    expect(document.title).toBe('Debt notice · Mikhtav')
    vi.mocked(fetch).mockRejectedValue(new Error('offline'))
    await act(() => queryClient.invalidateQueries())
    expect(await screen.findByText('The guide could not be refreshed. Showing the previously loaded version.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Debt notice' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Related official form' })).toBeInTheDocument()
    expect(screen.getByText('Related documents could not be refreshed. Showing the previously loaded list.')).toBeInTheDocument()
  })
})

