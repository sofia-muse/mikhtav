import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import i18n from '../shared/i18n'
it('keeps unknown paths on a useful 404 page with one H1', async () => {
  await i18n.changeLanguage('en')
  render(<MemoryRouter initialEntries={['/unknown?lang=en']}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  expect(screen.getByRole('link', { name: 'Browse explanations' })).toHaveAttribute('href', '/?lang=en')
  expect(document.title).toBe('Page not found · Mikhtav')
})
