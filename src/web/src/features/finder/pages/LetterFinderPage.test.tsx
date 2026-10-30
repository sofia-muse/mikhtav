import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { queryClient } from '../../../shared/data/queries'
import i18n from '../../../shared/i18n'
import type { Category } from '../../../shared/types'
import { LetterFinderPage, findCandidates } from './LetterFinderPage'

const letter = { id: 1, slug: 'debt', name: 'Debt notice', nameHe: 'הודעת חוב', summary: 'An outstanding balance.', triageHint: null, severity: 'critical' as const, hasActionRequired: true, hasDeadline: true, commonRank: 1 }
const categories: Category[] = [
  { id: 1, slug: 'insurance', name: 'National Insurance', issuer: 'National Insurance', letters: [letter] },
  { id: 2, slug: 'tax', name: 'Tax Authority', issuer: 'Tax Authority', letters: [{ ...letter, id: 2, slug: 'refund', name: 'Refund notice', nameHe: 'החזר מס' }] },
]

beforeEach(async () => {
  queryClient.clear(); queryClient.setDefaultOptions({ queries: { retry: false } })
  await i18n.changeLanguage('en')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => categories }))
})
afterEach(() => { cleanup(); queryClient.clear(); vi.unstubAllGlobals() })

describe('letter finder', () => {
  it('limits matches to selected issuer and Hebrew headings', () => {
    expect(findCandidates(categories, 'insurance', ['החזר מס'])).toEqual([])
    expect(findCandidates(categories, '', ['החזר מס']).map(result => result.letter.slug)).toEqual(['refund'])
  })

  it('preserves selected answers and back navigation across language changes', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinderPage /></MemoryRouter>)
    await user.click(await screen.findByRole('radio', { name: 'National Insurance' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Which headings can you see?' })).toHaveFocus()
    await user.click(screen.getByRole('checkbox', { name: 'הודעת חוב' }))
    await act(() => i18n.changeLanguage('he'))
    expect(await screen.findByRole('checkbox', { name: 'הודעת חוב' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'המשך' }))
    expect(screen.getByRole('link', { name: /לקריאת ההסבר.*Debt notice/ })).toHaveAttribute('href', '/letters/debt')
    await user.click(screen.getByRole('button', { name: 'חזרה' }))
    expect(screen.getByRole('checkbox', { name: 'הודעת חוב' })).toBeChecked()
  })

  it('shows no match without suggesting a known heading and can restart', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinderPage /></MemoryRouter>)
    await user.click(await screen.findByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('checkbox', { name: 'הודעת חוב' }))
    await user.click(screen.getByRole('checkbox', { name: 'None of these headings' }))
    expect(screen.getByRole('checkbox', { name: 'הודעת חוב' })).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('status')).toHaveTextContent('Possible matches: 0')
    expect(screen.queryByRole('link', { name: /Read the guide/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse all letter guides' })).toHaveAttribute('href', '/')
    await user.click(screen.getByRole('button', { name: 'Start again' }))
    expect(screen.getByRole('radio', { name: 'I am not sure' })).toBeChecked()
  })

  it('retries a failed catalog request', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('offline'))
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinderPage /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(await screen.findByRole('radio', { name: 'Tax Authority' })).toBeInTheDocument()
  })

  it('supports keyboard radio selection and heading checkboxes', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinderPage /></MemoryRouter>)
    const unknown = await screen.findByRole('radio', { name: 'I am not sure' })
    await user.tab()
    expect(unknown).toHaveFocus()
    await user.keyboard('[ArrowDown]')
    expect(screen.getByRole('radio', { name: 'National Insurance' })).toBeChecked()
    await user.tab()
    await user.keyboard('[Enter]')
    expect(screen.getByRole('heading', { level: 2, name: 'Which headings can you see?' })).toHaveFocus()
    await user.tab()
    await user.keyboard('[Space]')
    expect(screen.getByRole('checkbox', { name: 'הודעת חוב' })).toBeChecked()
  })
})
