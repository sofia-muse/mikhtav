import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import i18n from '../../i18n'
import { LetterDetailPage } from '../LetterDetailPage'

const detailPayload = {
  id: 3,
  slug: 'hov-bituach-leumi',
  name: 'National Insurance Debt Notice',
  nameHe: 'הודעת חוב',
  issuer: 'National Insurance Institute',
  categoryName: 'National Insurance',
  summary: 'Explains why a debt exists and how to respond before collection gets worse.',
  guidance: {
    overallSeverity: 'critical',
    primaryNextStep: 'Confirm the reason for the debt, then either pay, ask for instalments, or dispute it in writing right away.',
    deadlineSummary: null,
    needsDocuments: true,
    appliesWhen: 'unpaid national insurance contributions or a recalculation created an outstanding balance',
    recommendedChannel: 'Respond through the branch or payment route printed on the notice and keep the receipt or case reference.',
    whenToContactAuthority: 'you already paid, the debt reason is wrong, or you need an instalment plan before the deadline',
    whatToVerify: 'Verify the charged period, reason for the debt, total amount due, and the last payment date.',
  },
  sections: [
    {
      order: 1,
      labelHe: 'סכום לתשלום',
      explainer: 'Amount due on the notice.',
      actionRequired: 'Pay or dispute it immediately.',
      deadline: 'Pay by the date shown on the notice',
      severity: 'critical',
    },
  ],
}

describe('LetterDetailPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => detailPayload,
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the action-first guidance summary and trust reminder', async () => {
    await i18n.changeLanguage('en')

    render(
      <MemoryRouter initialEntries={['/letters/hov-bituach-leumi']}>
        <Routes>
          <Route path="/letters/:slug" element={<LetterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('What to do first')).toBeTruthy()
    expect(screen.getByText('Confirm the reason for the debt, then either pay, ask for instalments, or dispute it in writing right away.')).toBeTruthy()
    expect(screen.getByText('Likely yes — gather supporting documents before you respond.')).toBeTruthy()
    expect(screen.getByText(/Editorial guidance for a common version of this letter/)).toBeTruthy()
  })

  it('shows an explicit no-deadline state when no summary deadline is provided', async () => {
    await i18n.changeLanguage('en')

    render(
      <MemoryRouter initialEntries={['/letters/hov-bituach-leumi']}>
        <Routes>
          <Route path="/letters/:slug" element={<LetterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('No explicit deadline is highlighted here, but you should still act on the next step promptly.')).toBeTruthy()
  })
})
