import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { LettersIndexPage } from './LettersIndexPage'
import i18n from '../../../shared/i18n'
const categories = [{ id: 1, slug: 'tax', name: 'Tax', issuer: 'Tax Authority', letters: [{ id: 1, slug: 'tax-demand', name: 'Annual Tax Demand', nameHe: 'הודעת דרישה', summary: 'Tax amount', triageHint: 'Amount due', commonRank: 1, severity: 'critical', hasActionRequired: true, hasDeadline: true }] }]
const translation = { title: 'Tax form', summary: 'Public tax form' }
const documents = { schemaVersion: 1, documents: [{ id: 'tax-form', issuer: 'tax-authority', officialTitleHe: 'טופס', formNumber: '101', translations: { en: translation, he: translation, ru: translation, uk: translation }, relatedLetterSlugs: ['tax-demand'], retrieval: { status: 'verified' } }] }
function Location() { return <output data-testid="location">{useLocation().search}</output> }
beforeEach(async () => { await i18n.changeLanguage('en'); vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url.startsWith('/official') ? documents : categories }))) })
afterEach(() => vi.unstubAllGlobals())
describe('home discovery', () => {
  it('shows each featured letter once and groups unified search results', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LettersIndexPage /><Location /></MemoryRouter>)
    expect(await screen.findAllByText('Annual Tax Demand')).toHaveLength(1)
    await user.type(screen.getByRole('searchbox'), 'Tax')
    expect(screen.getByRole('heading', { name: 'Explanations' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Official documents' })).toBeInTheDocument()
    expect(await screen.findByText('Tax form')).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('q=Tax')
    await user.clear(screen.getByRole('searchbox')); await user.type(screen.getByRole('searchbox'), 'הודעת')
    expect(screen.getByText('Annual Tax Demand')).toBeInTheDocument()
  })
  it('restores a direct URL and offers a useful empty state', async () => {
    render(<MemoryRouter initialEntries={['/?lang=en&q=missing']}><LettersIndexPage /></MemoryRouter>)
    expect(await screen.findAllByText('No matches found')).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByText('Annual Tax Demand')).toBeInTheDocument()
  })
})
