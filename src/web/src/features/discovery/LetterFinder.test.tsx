import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LetterFinder, findCandidates } from './LetterFinder'
import { fetchIndex, type Category } from '../../api'

vi.mock('../../api', () => ({ fetchIndex: vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }))
const letter = { id: 1, slug: 'debt', name: 'Debt notice', nameHe: 'הודעת חוב', summary: 'An outstanding balance.', triageHint: null, severity: 'critical' as const, hasActionRequired: true, hasDeadline: true, commonRank: 1 }
const categories: Category[] = [
  { id: 1, slug: 'insurance', name: 'National Insurance', issuer: 'National Insurance', letters: [letter] },
  { id: 2, slug: 'tax', name: 'Tax Authority', issuer: 'Tax Authority', letters: [{ ...letter, id: 2, slug: 'refund', name: 'Refund notice', nameHe: 'החזר מס' }] },
]
afterEach(() => { cleanup(); vi.resetAllMocks() })

describe('letter finder', () => {
  it('filters by sender and actual heading without treating another sender as a match', () => {
    expect(findCandidates(categories, 'insurance', ['החזר מס'])).toEqual([])
    expect(findCandidates(categories, '', ['החזר מס']).map(item => item.letter.slug)).toEqual(['refund'])
    expect(findCandidates(categories, '', [])).toHaveLength(2)
  })
  it('guides through sender and heading and explains the resulting link', async () => {
    vi.mocked(fetchIndex).mockResolvedValue(categories)
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinder /></MemoryRouter>)
    await user.click(await screen.findByRole('radio', { name: 'National Insurance' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.queryByRole('checkbox', { name: 'החזר מס' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'הודעת חוב' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Selected Hebrew heading matches')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Read the guide.*Debt notice/ })).toHaveAttribute('href', '/letters/debt')
    expect(screen.getByText(/do not verify your letter/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start again' }))
    expect(screen.getByRole('radio', { name: 'I am not sure' })).toBeChecked()
  })
  it('offers retry after a failed catalog request', async () => {
    vi.mocked(fetchIndex).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(categories)
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinder /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toHaveTextContent('The catalog could not be loaded.')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('radio', { name: 'Tax Authority' })).toBeInTheDocument()
  })
  it('can report no match and keeps that choice exclusive with known headings', async () => {
    vi.mocked(fetchIndex).mockResolvedValue(categories)
    const user = userEvent.setup()
    render(<MemoryRouter><LetterFinder /></MemoryRouter>)
    await user.click(await screen.findByRole('button', { name: 'Continue' }))
    const knownHeading = screen.getByRole('checkbox', { name: 'הודעת חוב' })
    const none = screen.getByRole('checkbox', { name: 'None of these headings' })
    await user.click(knownHeading)
    await user.click(none)
    expect(knownHeading).not.toBeChecked()
    await user.click(knownHeading)
    expect(none).not.toBeChecked()
    await user.click(none)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('status')).toHaveTextContent('Possible matches: 0')
    expect(screen.getByText(/No matching guide in this catalog/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse all letter guides' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('link', { name: /Read the guide/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('checkbox', { name: 'None of these headings' })).toBeChecked()
  })
})
