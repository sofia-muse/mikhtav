import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../../i18n'
import { LanguageSwitcher } from '../LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
  })

  it('flips the document direction to RTL when Hebrew is selected', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)
    expect(document.documentElement.dir).toBe('ltr')

    await user.selectOptions(screen.getByRole('combobox'), 'he')

    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('he')
  })

  it('keeps the layout LTR when Russian is selected (Russian uses LTR)', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.selectOptions(screen.getByRole('combobox'), 'ru')

    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('ru')
  })
})
