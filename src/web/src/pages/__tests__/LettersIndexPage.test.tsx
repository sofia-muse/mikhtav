import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../i18n'
import { LettersIndexPage } from '../LettersIndexPage'

const indexPayload = [
  {
    id: 2,
    slug: 'mas-hachnasa',
    name: 'Income Tax',
    issuer: 'Israel Tax Authority',
    letters: [
      {
        id: 1,
        slug: 'drisha-shnatit',
        name: 'Annual Tax Demand Notice',
        nameHe: 'הודעת דרישה שנתית',
        summary: 'Explains the amount due and the payment deadline.',
        triageHint: 'the Tax Authority says you owe money or need to respond about a specific tax year',
        severity: 'critical',
        hasActionRequired: true,
        hasDeadline: true,
        commonRank: 1,
      },
    ],
  },
]

describe('LettersIndexPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => indexPayload,
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the common letters section with discovery badges in English', async () => {
    await i18n.changeLanguage('en')

    render(
      <MemoryRouter>
        <LettersIndexPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Start with the letters people see most often')).toBeTruthy()
    expect(screen.getAllByText('Annual Tax Demand Notice').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Action needed').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Has a deadline').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Critical').length).toBeGreaterThan(0)
    expect(screen.getByText(/Usually means:/)).toBeTruthy()
  })

  it('localises the common letters heading when Hebrew is active', async () => {
    await i18n.changeLanguage('he')

    render(
      <MemoryRouter>
        <LettersIndexPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('התחילו עם המכתבים שהכי נפוצים אצל עולים')).toBeTruthy()
  })
})
