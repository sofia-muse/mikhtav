import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './Layout'
import { LanguageSync } from './LanguageSync'
import i18n from '../shared/i18n'
import { initialLanguage, saveLanguage } from '../shared/i18n/language'
function Location() { return <output data-testid="location">{useLocation().search}</output> }
function setup(path = '/?q=tax&lang=en') { render(<MemoryRouter initialEntries={[path]}><LanguageSync /><Routes><Route element={<Layout />}><Route path="*" element={<Location />} /></Route></Routes></MemoryRouter>) }
beforeEach(async () => { localStorage.clear(); await i18n.changeLanguage('en') })
describe('site language and navigation', () => {
  it('uses URL, saved choice, first supported browser language, then English', () => {
    expect(initialLanguage('?lang=he', 'ru', ['uk'])).toBe('he')
    expect(initialLanguage('?lang=bad', 'ru', ['uk'])).toBe('ru')
    expect(initialLanguage('', null, ['de', 'uk-UA', 'he'])).toBe('uk')
    expect(initialLanguage('', null, ['de'])).toBe('en')
  })
  it('preserves filters and persists manual language selection with RTL', async () => {
    setup(); expect(within(screen.getByRole('navigation')).queryByRole('combobox')).toBeNull()
    await userEvent.selectOptions(screen.getByRole('combobox'), 'he')
    expect(screen.getByTestId('location')).toHaveTextContent('q=tax&lang=he')
    expect(localStorage.getItem('mikhtav:language')).toBe('he')
    expect(document.documentElement.dir).toBe('rtl')
  })
  it('continues when local storage is denied', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    expect(() => saveLanguage('ru')).not.toThrow(); spy.mockRestore()
  })
  it('closes the mobile menu with Escape and restores trigger focus', async () => {
    setup(); const trigger = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(trigger); expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}'); expect(trigger).toHaveAttribute('aria-expanded', 'false'); expect(trigger).toHaveFocus()
  })
})
