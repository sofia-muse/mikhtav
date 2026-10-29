import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '../../shared/i18n'
import type { LetterDetail } from '../../shared/types'
import { EditorialSources } from './EditorialSources'

afterEach(cleanup)
const letter = { translationComplete: false, editorial: { version: '1.1', sourceCheckedOn: '2026-10-28', sources: [
  { title: 'Official page', url: 'https://www.btl.gov.il/example', scope: 'General English scope.', scopeTranslations: { ru: 'Общие сведения, без проверки личного дела.' } },
  { title: 'Unsafe page', url: 'javascript:alert(1)', scope: 'Ignore this.' },
] } } as LetterDetail

describe('editorial sources', () => {
  it('shows localized source limitations and incomplete translation status', async () => {
    await i18n.changeLanguage('ru')
    render(<EditorialSources letter={letter} />)
    expect(screen.getByText('Общие сведения, без проверки личного дела.')).toHaveAttribute('lang', 'ru')
    expect(screen.getByText(/Часть материала показана на английском/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Unsafe page/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Official page/ })).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not crash on an invalid source date and identifies an English scope fallback', async () => {
    await i18n.changeLanguage('he')
    render(<EditorialSources letter={{ ...letter, editorial: { ...letter.editorial!, sourceCheckedOn: 'not-a-date' } }} />)
    expect(screen.getByText('not-a-date')).toBeInTheDocument()
    expect(screen.getByText('General English scope.')).toHaveAttribute('lang', 'en')
  })
})
