import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { LetterDetail } from '../../shared/types'
import '../../i18n'
import { LetterChecklist } from './LetterChecklist'

const letter = { slug: 'test-letter', name: 'Test letter', sections: [
  { order: 1, actionRequired: 'Prepare documents' },
  { order: 2, actionRequired: 'Prepare documents' },
  { order: 3, actionRequired: 'Contact the authority' },
] } as LetterDetail

describe('LetterChecklist', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => { cleanup(); vi.restoreAllMocks() })

  it('deduplicates actions, persists progress and resets it', () => {
    const view = render(<LetterChecklist letter={letter} language="en" />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Prepare documents' }))
    expect(JSON.parse(localStorage.getItem('mikhtav:checklist:v1:test-letter:legacy')!)).toEqual({ version: 1, completed: [1, 2] })
    view.unmount()
    render(<LetterChecklist letter={letter} language="en" />)
    expect(screen.getByRole('checkbox', { name: 'Prepare documents' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Clear completed actions' }))
    expect(screen.getByRole('checkbox', { name: 'Prepare documents' })).not.toBeChecked()
  })

  it('keeps letter progress separate and retains it after switching language', () => {
    const view = render(<LetterChecklist letter={letter} language="en" />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    view.rerender(<LetterChecklist letter={{ ...letter, slug: 'other-letter' }} language="en" />)
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    view.rerender(<LetterChecklist letter={{ ...letter, sections: [{ order: 1, actionRequired: 'הכנת מסמכים' }, { order: 2, actionRequired: 'הכנת מסמכים' }] } as LetterDetail} language="he" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByRole('region')).toHaveAttribute('dir', 'rtl')
  })

  it('keeps working in memory when storage is denied', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied') })
    render(<LetterChecklist letter={letter} language="en" />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
    expect(screen.getByText(/Browser storage is unavailable/)).toBeInTheDocument()
  })

  it('invalidates completed actions when the editorial version changes', () => {
    const versioned = { ...letter, editorial: { version: '1.1', sourceCheckedOn: '2026-10-28', sources: [] } }
    const view = render(<LetterChecklist letter={versioned} language="en" />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    view.rerender(<LetterChecklist letter={{ ...versioned, editorial: { ...versioned.editorial, version: '1.2' } }} language="en" />)
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    view.rerender(<LetterChecklist letter={versioned} language="ru" />)
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })

  it('limits print mode to the checklist and restores the page after printing', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {
      expect(document.body).toHaveAttribute('data-checklist-print')
      expect(screen.getByRole('region')).toHaveAttribute('data-checklist-root')
    })
    render(<LetterChecklist letter={letter} language="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Print checklist' }))
    expect(print).toHaveBeenCalledOnce()
    expect(document.body).not.toHaveAttribute('data-checklist-print')
  })
})
